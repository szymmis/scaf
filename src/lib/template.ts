import fs from "fs";
import path from "path";
import toml from "smol-toml";
import { TEMPLATE_DIR } from "./scaffolder";
import { Logger } from "./logger";

export class Template {
  lang: string;
  runCommand: string;
  testCommand: string;

  constructor(lang: string, runCommand: string, testCommand: string) {
    this.lang = lang;
    this.runCommand = runCommand;
    this.testCommand = testCommand;
  }

  static fromString(lang: string): Template {
    try {
      const data = fs.readFileSync(
        path.join(TEMPLATE_DIR, lang, ".template"),
        "utf8"
      );
      const config = toml.parse(data) as { run: string; test: string };
      return new Template(lang, config.run, config.test);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("No such file or directory")) {
          Logger.panic(
            `Template ${lang} does not have .template file`,
            "Looks like the template is broken, report it."
          );
        }
      }
      throw e;
    }
  }
}
