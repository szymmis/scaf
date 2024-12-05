import { program, Argument } from "commander";

import { version } from "../../package.json";
import init from "./commands/init";
import advance from "./commands/advance";
import { Parsers } from "./parsers";
import run from "./commands/run";
import test from "./commands/test";
import login from "./commands/login";
import { MissingTaskError } from "../lib/errors";
import { Logger } from "../lib/logger";
import { Colors } from "../lib/colors";

const taskArgument = new Argument(
  "[task]",
  "Task number in the <day> or <day/year> format"
)
  .argParser(Parsers.parseTaskNumber)
  .default(
    { day: new Date().getDate(), year: new Date().getFullYear() },
    "today"
  );

program
  .command("login")
  .description("setup token to authorize into the AoC account")
  .action(login);

program
  .command("init")
  .addArgument(taskArgument)
  .option("-l, --lang <template>", "Template language to use", "go")
  .option("--open", "Open task in browser", false)
  .description("init task directory using given template language")
  .action(init);

program
  .command("advance")
  .addArgument(taskArgument)
  .option("--open", "Open task in browser", false)
  .description("advance task to second part if first part is submitted")
  .action(advance);

program
  .command("run")
  .addArgument(taskArgument)
  .description("invoke run command for the task template")
  .action(run);

program
  .command("test")
  .addArgument(taskArgument)
  .description("run tests for the task")
  .action(test);

try {
  process.on("unhandledRejection", handleError);
  program.version(version).parse();
} catch (e) {
  handleError(e);
}

function handleError(e: unknown) {
  if (e instanceof MissingTaskError) {
    Logger.panic(
      `Task ${e.day}/${e.year} not found in .scafconfig`,
      `Use ${Colors.yellow(
        "scaf init"
      )} to set it up or if the task exist, edit ${Colors.yellow(
        ".scafconfig"
      )} to link it.`
    );
  } else {
    throw e;
  }
}
