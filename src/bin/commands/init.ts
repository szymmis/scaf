import open from "open";
import { Api, HttpError } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";
import { ConfigParser } from "../../lib/config";
import { Task } from "../../lib/task";
import path from "path";
import { Logger } from "../../lib/logger";
import { TaskAlreadyExistsError } from "../../lib/errors";

export default async function init(
  t: {
    day: number;
    year: number;
  },
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

    await Scaffolder.initTask(config, task, examples, answers);

    if (options.open) {
      Logger.log(`Opening task ${t.day}/${t.year} in browser...`);
      open(Api.getTaskURL(task.year, task.day));
    }

    Logger.success(`Task ${t.day}/${t.year} initialized successfully.`);
  } catch (e) {
    if (e instanceof HttpError) {
      Logger.panic(
        `Cannot fetch task ${t.day}/${t.year} from Advent of Code`,
        "You might have found a bug. Try again later or report it."
      );
    } else if (e instanceof TaskAlreadyExistsError) {
      Logger.log(`Task ${t.day}/${t.year} already exists.`);
    } else {
      throw e;
    }
  }
}
