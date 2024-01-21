import { Scaffolder } from "./scaffolder";
import { Cache } from "./cache";
import { Parser } from "./parser";
import { execSync } from "child_process";
import open from "open";
import { Api } from "./api";

async function main(year: number, day: number) {
  const advanceCmd = process.argv.includes("advance");

  const task = await Cache.loadTask(year, day, advanceCmd);
  await Cache.loadTaskInput(year, day);
  const { examples, answers, hasPartTwo } = await Parser.parseTask(task);

  if (advanceCmd) {
    if (!hasPartTwo)
      throw new Error("You have not submited answer for part one yet!");
    let output = await Scaffolder.advanceTask(year, day, examples, answers);
    if (process.argv.includes("--open") && output) {
      execSync(`code ${output}/src/main.rs`);
      open(Api.getTaskURL(year, day));
    }
  } else {
    const output = await Scaffolder.initTask(year, day, examples, answers);
    if (process.argv.includes("--open") && output) {
      execSync(`code ${output}/src/main.rs`);
      open(Api.getTaskURL(year, day));
    }
  }
}

if (process.argv.includes("--task")) {
  const match = process.argv.join(" ").match(/--task (\d{4})\/(\d{2})/);
  if (match && match.length >= 3) {
    main(Number(match[1]), Number(match[2]));
  } else {
    throw new Error(
      "Invalid task parameter. Correct syntax:\n\t--task 0000/00"
    );
  }
} else {
  const YEAR = new Date().getFullYear();
  const DAY = new Date().getDate();
  main(YEAR, DAY);
}
