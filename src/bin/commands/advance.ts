import open from "open";
import { Api } from "../../lib/api";
import { Cache } from "../../lib/cache";
import { Parser } from "../../lib/parser";
import { Scaffolder } from "../../lib/scaffolder";
import { Logger } from "../../lib/logger";
import { Task } from "../../lib/task";

export default async function advance(task: Task, options: { open: boolean }) {
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

  await Scaffolder.advanceTask(task, examples, answers);

  if (options.open) {
    open(Api.getTaskURL(task.year, task.day));
  }

  Logger.success(`Task ${task.day}/${task.year} advanced successfully.`);
}
