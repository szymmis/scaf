import { execSync } from "child_process";
import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";

export default async function init(
  lang: string,
  taskId: string,
  options: { open: boolean }
) {
  const [year, day] = taskId.split("/").map(Number);
  try {
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
  } catch (e) {
    if (e instanceof HttpError) {
      console.error(`Cannot fetch task ${taskId} from Advent of Code`);
    } else {
      throw e;
    }
  }
}
