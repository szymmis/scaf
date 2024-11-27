import { program } from "commander";

import init from "./commands/init";
import advance from "./commands/advance";

program
  .command("init")
  .argument("<lang>", "Template language to use")
  .argument(
    "[task]",
    "Task number in the y/d format",
    new Date().getFullYear() + "/" + new Date().getDate()
  )
  .option("--open", "Open task in browser", false)
  .description("init task directory using given template language")
  .action(init);

program
  .command("advance")
  .argument(
    "[task]",
    "Task number in the y/d format",
    new Date().getFullYear() + "/" + new Date().getDate()
  )
  .option("--open", "Open task in browser", false)
  .description("advance task to second part if first answer is submitted")
  .action(advance);

program.parse();
