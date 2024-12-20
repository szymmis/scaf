import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { Cache } from "./cache";
import { Task } from "./task";
import { Config, ConfigParser } from "./config";
import { Logger } from "./logger";
import { MissingTaskError, TaskAlreadyExistsError } from "./errors";

type Patches = Record<string, string | number>;

export const TEMPLATE_DIR = path.join(import.meta.dirname, "../../templates");

export class Scaffolder {
  private static getPatches(
    task: Task,
    part: "one" | "two",
    input: string,
    answer: string | number
  ): Patches {
    return {
      DAY: task.day.toString().padStart(2, "0"),
      YEAR: task.year.toString(),
      [part === "one" ? "INPUT_1" : "INPUT_2"]: input,
      [part === "one" ? "ANSWER_1" : "ANSWER_2"]: answer,
    };
  }

  private static async applyPatchesToFile(filepath: string, patches: Patches) {
    await fs.writeFile(
      filepath,
      Object.entries(patches).reduce(
        (result, [key, value]) =>
          result.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
        await fs.readFile(filepath, "utf8")
      ),
      "utf8"
    );
  }

  private static async removeCommentsFromFile(filepath: string) {
    await fs.writeFile(
      filepath,
      (await fs.readFile(filepath, "utf8"))
        .replaceAll("//**scaf**|", "")
        .replaceAll("#**scaf**|", ""),
      "utf8"
    );
  }

  private static async directoryExists(dirname: string): Promise<boolean> {
    try {
      return (await fs.stat(dirname)).isDirectory();
    } catch {
      return false;
    }
  }

  private static async getGitIgnoreEntries(dirname: string) {
    const gitIgnoreFilePath = path.join(dirname, ".gitignore");

    try {
      return (await fs.readFile(gitIgnoreFilePath, "utf8"))
        .split("\n")
        .map((entry) => entry.trim())
        .filter((entry) => entry);
    } catch {
      return [];
    }
  }

  private static async getPatchableFiles(dirname: string) {
    const filenames = await fs.readdir(dirname, { recursive: true });
    const ignoredFiles = [
      ...(await this.getGitIgnoreEntries(dirname)),
      ".template",
    ];

    return filenames.filter(
      (filename) =>
        !ignoredFiles.some((entry) => filename.includes(entry)) &&
        fsSync.statSync(path.join(dirname, filename)).isFile()
    );
  }

  private static async copyTemplate(
    template: string,
    dirname: string,
    patches: Patches
  ) {
    const templatePath = path.join(TEMPLATE_DIR, template);

    if (!(await this.directoryExists(templatePath))) {
      return Logger.panic(`Template ${template} doesn't exist`);
    }

    await fs.mkdir(dirname, { recursive: true });

    for (const filename of await this.getPatchableFiles(templatePath)) {
      const source = path.join(templatePath, filename);
      const destination = path.join(
        dirname,
        filename.startsWith("_") ? filename.replace("_", ".") : filename
      );
      await fs.cp(source, destination, { recursive: true });
      await this.applyPatchesToFile(destination, patches);
    }
  }

  static async initTask(
    config: Config,
    task: Task,
    examples: string[],
    answers: (string | number)[]
  ): Promise<string | null> {
    const dirname = task.getPath();
    if (await this.directoryExists(dirname))
      throw new TaskAlreadyExistsError(task.day, task.year);

    const patches = this.getPatches(task, "one", examples[0], answers[0]);
    await this.copyTemplate(task.template.lang, dirname, patches);
    await this.createTaskInput(task);

    config.setTask(task);
    ConfigParser.write(config);

    return dirname;
  }

  static async advanceTask(
    task: Task,
    examples: string[],
    answers: (string | number)[]
  ) {
    const dirname = task.getPath();

    if (!this.directoryExists(dirname)) {
      throw new MissingTaskError(task.day, task.year);
    }

    const patches = this.getPatches(
      task,
      "two",
      examples[1] ?? examples[0],
      answers[1]
    );

    for (const filename of await this.getPatchableFiles(dirname)) {
      const source = path.join(dirname, filename);
      await this.applyPatchesToFile(source, patches);
      await this.removeCommentsFromFile(source);
    }

    return dirname;
  }

  static async createTaskInput(task: Task) {
    const inputPath = task.getInputPath();

    if (!fsSync.existsSync(inputPath)) {
      await fs.writeFile(inputPath, await Cache.loadTaskInput(task));
    }
  }
}
