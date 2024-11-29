import { execSync } from "child_process";
import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";
import { ConfigParser } from "../../lib/config";
import { Task } from "../../lib/task";
import path from "path";

export default async function init(
  t: { day: number; year: number },
  options: { lang: string; open: boolean }
) {
  const config = ConfigParser.parse();

  try {
    const task = new Task(
      t.day,
      t.year,
      options.lang,
      path.join(
        config.getRoot(),
        String(t.year),
        String(t.day).padStart(2, "0")
      )
    );

    await Cache.loadTaskInput(task);
    const { examples, answers } = await Parser.parseTask(
      await Cache.loadTask(task, false)
    );

    const output = await Scaffolder.initTask(config, task, examples, answers);

    if (options.open) {
      execSync(`code ${output}`);
      open(Api.getTaskURL(task.year, task.day));
    }
  } catch (e) {
    if (e instanceof HttpError) {
      console.error(
        `Cannot fetch task ${t.day}/${t.year} from Advent of Code`,
        e.message
      );
    } else {
      throw e;
    }
  }
}
