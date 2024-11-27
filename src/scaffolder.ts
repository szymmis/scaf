import fs from "fs/promises";
import path from "path";

type Patches = Record<string, string | number>;

export class Scaffolder {
  private static getDirName(year: number, day: number): string {
    if (new Date().getFullYear() === year) {
      return `${day.toString().padStart(2, "0")}`;
    } else {
      return `${year}_${day.toString().padStart(2, "0")}`;
    }
  }

  private static getPatches(
    year: number,
    day: number,
    task: "one" | "two",
    input: string,
    answer: string | number
  ): Patches {
    return {
      DAY: day.toString().padStart(2, "0"),
      YEAR: year.toString(),
      [task === "one" ? "INPUT_1" : "INPUT_2"]: input,
      [task === "one" ? "ANSWER_1" : "ANSWER_2"]: answer,
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
        .replaceAll("/**scaf**", "")
        .replaceAll("**scaf**/", ""),
      "utf8"
    );
  }

  private static async copyTemplate(
    template: string,
    dirname: string,
    patches: Patches
  ) {
    const templatePath = path.join(import.meta.dir, `templates/${template}`);

    if (!(await fs.exists(templatePath))) {
      throw new Error(`Template ${template} doesn't exist!`);
    }
    await fs.mkdir(dirname, { recursive: true });

    // @ts-expect-error Apparently `recursive` is not a valid option in bun types
    const filenames = await fs.readdir(templatePath, { recursive: true });
    for (const filename of filenames) {
      const source = path.join(templatePath, filename);
      const destination = path.join(dirname, filename);
      if (filename !== "__config.json" && (await fs.stat(source)).isFile()) {
        await fs.cp(source, destination);
        await this.applyPatchesToFile(destination, patches);
      }
    }
  }

  static async initTask(
    template: string,
    year: number,
    day: number,
    examples: string[],
    answers: (string | number)[]
  ): Promise<string | null> {
    const dirname = this.getDirName(year, day);

    if (await fs.exists(dirname)) return dirname;

    const patches = this.getPatches(year, day, "one", examples[0], answers[0]);
    await this.copyTemplate(template, dirname, patches);

    return dirname;
  }

  static async advanceTask(
    year: number,
    day: number,
    examples: string[],
    answers: (string | number)[]
  ) {
    const dirname = this.getDirName(year, day);

    if (!(await fs.exists(dirname)))
      throw new Error(`Directory of task ${year}/${day} doesn't exist!`);

    const patches = this.getPatches(year, day, "two", examples[1], answers[1]);

    // @ts-expect-error Apparently `recursive` is not a valid option in bun types
    const filenames = await fs.readdir(dirname, { recursive: true });
    for (const filename of filenames) {
      const source = path.join(dirname, filename);
      if (filename !== "__config.json" && (await fs.stat(source)).isFile()) {
        await this.applyPatchesToFile(source, patches);
        await this.removeCommentsFromFile(source);
      }
    }

    return dirname;
  }
}
