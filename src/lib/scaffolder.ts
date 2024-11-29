import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { Cache } from "./cache";
import { Task } from "./task";
import { Config, ConfigParser } from "./config";

type Patches = Record<string, string | number>;

const TEMPLATE_DIR = path.join(import.meta.dirname, "../../templates");

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
    const gitIgnoredFiles = await this.getGitIgnoreEntries(dirname);

    return filenames.filter(
      (filename) =>
        !gitIgnoredFiles.some((entry) => filename.includes(entry)) &&
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
      throw new Error(`Template ${template} doesn't exist!`);
    }

    await fs.mkdir(dirname, { recursive: true });

    for (const filename of await this.getPatchableFiles(templatePath)) {
      const source = path.join(templatePath, filename);
      const destination = path.join(dirname, filename);
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
    if (await this.directoryExists(dirname)) return dirname;

    const patches = this.getPatches(task, "one", examples[0], answers[0]);
    await this.copyTemplate(task.template, dirname, patches);
    await fs.writeFile(
      path.join(dirname, "input.txt"),
      await Cache.loadTaskInput(task)
    );

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
      throw new Error(
        `Directory of task ${task.year}/${task.day} doesn't exist!`
      );
    }

    const patches = this.getPatches(task, "two", examples[1], answers[1]);

    for (const filename of await this.getPatchableFiles(dirname)) {
      const source = path.join(dirname, filename);
      await this.applyPatchesToFile(source, patches);
      await this.removeCommentsFromFile(source);
    }

    return dirname;
  }
}
