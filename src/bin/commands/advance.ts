import { execSync } from "child_process";
import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";
import { ConfigParser } from "../../lib/config";

export default async function advance(
  t: { day: number; year: number },
  options: { open: boolean }
) {
  const config = ConfigParser.parse();
  const task = config.getTask(t.day, t.year);

  if (!task) {
    throw new Error(`Task ${t.day}/${t.year} entry not found in .scafconfig`);
  }

  try {
    await Cache.loadTaskInput(task);
    const { examples, answers, hasPartTwo } = await Parser.parseTask(
      await Cache.loadTask(task, false)
    );

    if (!hasPartTwo) {
      throw new Error("You have not submited answer for part one yet!");
    }

    const output = await Scaffolder.advanceTask(task, examples, answers);

    if (options.open) {
      execSync(`code ${output}`);
      open(Api.getTaskURL(task.year, task.day));
    }
  } catch (e) {
    if (e instanceof HttpError) {
      console.error(
        `Cannot fetch task ${task.day}/${task.year} from Advent of Code`
      );
    } else {
      throw e;
    }
  }
}
