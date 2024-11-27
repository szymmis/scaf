import { execSync } from "child_process";
import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";

export default async function advance(
  taskId: string,
  options: { open: boolean }
) {
  const [year, day] = taskId.split("/").map(Number);
  try {
    const task = await Cache.loadTask(year, day, false);
    await Cache.loadTaskInput(year, day);
    const { examples, answers, hasPartTwo } = await Parser.parseTask(task);

    if (!hasPartTwo) {
      throw new Error("You have not submited answer for part one yet!");
    }

    const output = await Scaffolder.advanceTask(year, day, examples, answers);

    if (options.open) {
      execSync(`code ${output}`);
      open(Api.getTaskURL(year, day));
    }
  } catch (e) {
    if (e instanceof HttpError) {
      console.error(`Cannot fetch task ${taskId} from Advent of Code`);
    } else {
      throw e;
    }
  }
}
