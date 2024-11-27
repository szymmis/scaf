import { Scaffolder } from "./scaffolder";
import { Cache } from "./cache";
import { Parser } from "./parser";
import { execSync } from "child_process";
import open from "open";
import { Api } from "./api";

import { program } from "commander";

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
  .action(async (lang: string, taskId: string, options: { open: boolean }) => {
    const [year, day] = taskId.split("/").map(Number);
    const task = await Cache.loadTask(year, day, false);
    await Cache.loadTaskInput(year, day);
    const { examples, answers } = await Parser.parseTask(task);

    const output = await Scaffolder.initTask(
      lang,
      year,
      day,
      examples,
      answers
    );

    if (options.open) {
      execSync(`code ${output}`);
      open(Api.getTaskURL(year, day));
    }
  });

program
  .command("advance")
  .argument(
    "[task]",
    "Task number in the y/d format",
    new Date().getFullYear() + "/" + new Date().getDate()
  )
  .option("--open", "Open task in browser", false)
  .description("advance task to second part if first answer is submitted")
  .action(async (taskId: string, options: { open: boolean }) => {
    const [year, day] = taskId.split("/").map(Number);
    const task = await Cache.loadTask(year, day, false);
    await Cache.loadTaskInput(year, day);
    const { examples, answers } = await Parser.parseTask(task);

    const output = await Scaffolder.advanceTask(year, day, examples, answers);

    if (options.open) {
      execSync(`code ${output}`);
      open(Api.getTaskURL(year, day));
    }
  });

program.parse();
