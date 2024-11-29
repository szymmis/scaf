import { program, Argument } from "commander";

import init from "./commands/init";
import advance from "./commands/advance";
import { Parsers } from "./parsers";

program
  .command("init")
  .addArgument(
    new Argument("[task]", "Task number in the <day> or <day/year> format")
      .argParser(Parsers.parseTaskNumber)
      .default(
        { day: new Date().getDate(), year: new Date().getFullYear() },
        "today"
      )
  )
  .option("-l, --lang <template>", "Template language to use", "go")
  .option("--open", "Open task in browser", false)
  .description("init task directory using given template language")
  .action(init);

program
  .command("advance")
  .addArgument(
    new Argument("[task]", "Task number in the <day> or <day/year> format")
      .argParser(Parsers.parseTaskNumber)
      .default(
        { day: new Date().getDate(), year: new Date().getFullYear() },
        "today"
      )
  )
  .option("--open", "Open task in browser", false)
  .description("advance task to second part if first answer is submitted")
  .action(advance);

program.parse();
