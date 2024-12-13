import { spawnSync } from "child_process";
import { ConfigParser } from "../../lib/config";
import { MissingTaskError } from "../../lib/errors";
import { Scaffolder } from "../../lib/scaffolder";

export default async function run(t: { day: number; year: number }) {
  const config = ConfigParser.parse();
  const task =
    config.getTaskByPath(process.cwd()) ?? config.getTask(t.day, t.year);

  if (!task) throw new MissingTaskError(t.day, t.year);

  await Scaffolder.createTaskInput(task);

  spawnSync(task.template.runCommand, {
    stdio: "inherit",
    shell: true,
    cwd: task.getPath(),
  });
}
