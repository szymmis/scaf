import { spawnSync } from "child_process";
import { ConfigParser } from "../../lib/config";

export default function run(t: { day: number; year: number }) {
  const config = ConfigParser.parse();
  const task =
    config.getTaskByPath(process.cwd()) ?? config.getTask(t.day, t.year);

  if (!task) {
    throw new Error(`Task ${t.year}/${t.day} doesn't exist!`);
  }

  spawnSync(task.template.runCommand, {
    stdio: "inherit",
    shell: true,
    cwd: task.getPath(),
  });
}
