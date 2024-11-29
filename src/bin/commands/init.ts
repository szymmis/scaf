import { execSync } from "child_process";
import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";

export default async function init(
  task: { day: number; year: number },
  options: { lang: string; open: boolean }
) {
  const { day, year } = task;

  try {
    await Cache.loadTaskInput(year, day);
    const { examples, answers } = await Parser.parseTask(
      await Cache.loadTask(year, day, false)
    );

    const output = await Scaffolder.initTask(
      options.lang,
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
      console.error(
        `Cannot fetch task ${day}/${year} from Advent of Code`,
        e.message
      );
    } else {
      throw e;
    }
  }
}
