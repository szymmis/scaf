import fs from "fs";
import path from "path";
import { Cache } from "./cache";

import templateRs from "./template.rs.txt";

export class Scaffolder {
  private static getDirName(year: number, day: number): string {
    if (new Date().getFullYear() === year) {
      return `${day.toString().padStart(2, "0")}`;
    } else {
      return `${year}_${day.toString().padStart(2, "0")}`;
    }
  }

  static async initTask(
    year: number,
    day: number,
    examples: string[],
    answers: string[]
  ): Promise<string | null> {
    const dirname = this.getDirName(year, day);

    if (fs.existsSync(dirname)) return dirname;

    fs.mkdirSync(dirname);
    fs.mkdirSync(path.join(dirname, "src"));
    fs.writeFileSync(
      path.join(dirname, "input.txt"),
      await Cache.loadTaskInput(year, day)
    );
    fs.writeFileSync(
      path.join(dirname, "src", "main.rs"),
      templateRs
        .replace("<<INPUT_1>>", examples[0].replaceAll("\n", "\\n"))
        .replace("<<ANSWER_1>>", answers[0])
    );
    fs.writeFileSync(
      path.join(dirname, "Cargo.toml"),
      `[package]
      name="task_${day.toString().padStart(2, "0")}"
      version="0.1.0"`
    );

    return dirname;
  }

  static async advanceTask(
    year: number,
    day: number,
    examples: string[],
    answers: string[]
  ) {
    const dirname = this.getDirName(year, day);

    if (!fs.existsSync(dirname))
      throw new Error(`Directory of task ${year}/${day} doesn't exist!`);

    const srcFilePath = path.join(dirname, "src", "main.rs");

    fs.writeFileSync(
      srcFilePath,
      fs
        .readFileSync(srcFilePath, "utf8")
        .replace(
          "// <<FN_2>>",
          "fn part_two(input: &str) -> i32 {\n\ttodo!()\n}"
        )
        .replace("// <<PRINT_2>>", 'println!("Part two: {}", part_two(&input))')
        .replace(
          "// <<TEST_2>>",
          `#[test]\n\tfn part_two_example() {\n\t\tlet input = "${(
            examples[1] ?? examples[0]
          ).replaceAll("\n", "\\n")}";\n\t\tassert_eq!(part_two(input), ${
            answers[1] ?? answers[0]
          });\n\t}`
        ),
      "utf8"
    );

    return dirname;
  }
}
