import { spawnSync } from "child_process";
import { ConfigParser } from "../../lib/config";
import { MissingTaskError } from "../../lib/errors";

export default function test(t: { day: number; year: number }) {
  const config = ConfigParser.parse();
  const task =
    config.getTaskByPath(process.cwd()) ?? config.getTask(t.day, t.year);

  if (!task) throw new MissingTaskError(t.day, t.year);

  spawnSync(task.template.testCommand, {
    stdio: "inherit",
    shell: true,
    cwd: task.getPath(),
  });
}
