import { program, Argument } from "commander";

import { version } from "../../package.json";
import init from "./commands/init";
import advance from "./commands/advance";
import { Parsers } from "./parsers";
import run from "./commands/run";
import test from "./commands/test";
import login from "./commands/login";

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

program.version(version).parse();
