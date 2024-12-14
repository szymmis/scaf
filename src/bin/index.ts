import { program, Argument } from "commander";

import { version } from "../../package.json";
import init from "./commands/init";
import advance from "./commands/advance";
import { Parsers } from "./parsers";
import run from "./commands/run";
import test from "./commands/test";
import login from "./commands/login";
import { MissingTaskError, NoTaskInCwdError } from "../lib/errors";
import { Logger } from "../lib/logger";
import { Colors } from "../lib/colors";
import open from "./commands/open";

program
  .command("login")
  .description("setup token to authorize into the AoC account")
  .action(login);

const TASK_NUMBER_ARG = new Argument(
  "[task]",
  "Task number in the <day> or <day/year> format"
)
  .default(
    { day: new Date().getDate(), year: new Date().getFullYear() },
    "today"
  )
  .argParser(Parsers.parseTaskNumber);

program
  .command("open")
  .addArgument(TASK_NUMBER_ARG)
  .description("open task description in your default browser")
  .action(open);

program
  .command("init")
  .addArgument(TASK_NUMBER_ARG)
  .option("-l, --lang <template>", "Template language to use", "go")
  .option("--open", "Open task in browser", false)
  .description("init task directory using given template language")
  .action(init);

const TASK_ARG = new Argument(
  "[task]",
  "Task number in the <day> or <day/year> format"
);

program
  .command("advance")
  .addArgument(TASK_ARG)
  .option("--open", "Open task in browser", false)
  .description("advance task to second part if first part is submitted")
  .action(parseTask(advance));

program
  .command("run")
  .addArgument(TASK_ARG)
  .description("invoke run command for the task template")
  .action(parseTask(run));

program
  .command("test")
  .addArgument(TASK_ARG)
  .description("run tests for the task")
  .action(parseTask(test));

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
  } else if (e instanceof NoTaskInCwdError) {
    Logger.panic(
      "Current working directory is not a scaf task",
      `Make sure you are in the ${Colors.yellow(
        "correct path"
      )} or specify ${Colors.yellow("task number")}.`
    );
  } else {
    throw e;
  }
}

function parseTask(action: (...args: any[]) => void) {
  return (task: string | undefined, ...params: unknown[]) => {
    return action(
      Parsers.parseTask(task ? Parsers.parseTaskNumber(task) : undefined),
      ...params
    );
  };
}
