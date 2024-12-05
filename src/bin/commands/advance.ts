import { execSync } from "child_process";
import open from "open";
import { Api } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";
import { ConfigParser } from "../../lib/config";
import { Logger } from "../../lib/logger";
import { Colors } from "../../lib/colors";
import { MissingTaskError } from "../../lib/errors";

export default async function advance(
  t: { day: number; year: number },
  options: { open: boolean }
) {
  const config = ConfigParser.parse();
  const task =
    config.getTaskByPath(process.cwd()) ?? config.getTask(t.day, t.year);

  if (!task) throw new MissingTaskError(t.day, t.year);

  await Cache.loadTaskInput(task);
  const { examples, answers, hasPartTwo } = await Parser.parseTask(
    await Cache.loadTask(task, true)
  );

  if (!hasPartTwo) {
    return Logger.panic(
      "Answer for part one is not submitted yet",
      "You can do that through the AoC website."
    );
  }

  const output = await Scaffolder.advanceTask(task, examples, answers);

  if (options.open) {
    execSync(`code ${output}`);
    open(Api.getTaskURL(task.year, task.day));
  }
}
