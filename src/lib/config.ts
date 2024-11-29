import path from "path";
import fs from "fs";
import toml from "smol-toml";
import { z } from "zod";
import { Task } from "./task";

const ConfigTaskSchema = z.object({
  lang: z.string(),
  dirname: z.string(),
});

const ConfigSchema = z.record(
  z.object({
    lang: z.string().optional(),
    dirname: z.string(),
    tasks: z.record(ConfigTaskSchema),
  })
);

export class Config {
  private path: string;
  private _config: z.infer<typeof ConfigSchema>;

  constructor(path: string, config: z.infer<typeof ConfigSchema>) {
    this.path = path;
    this._config = config;
  }

  getRawConfig() {
    return this._config;
  }

  getPath(): string {
    return this.path;
  }

  getRoot(): string {
    return path.dirname(this.path);
  }

  getTask(day: number, year: number): Task | null {
    const task = this._config[year]?.tasks[`${day}`.padStart(2, "0")];
    if (!task) return null;

    return new Task(
      day,
      year,
      task.lang,
      path.join(this.getRoot(), this._config[year].dirname, task.dirname)
    );
  }

  getTaskByPath(taskPath: string): Task | null {
    for (const year in this._config) {
      for (const day in this._config[year].tasks) {
        const task = this.getTask(parseInt(day), parseInt(year));
        if (task?.getPath() === taskPath) {
          return task;
        }
      }
    }

    return null;
  }

  setTask(task: Task) {
    if (!this._config[task.year])
      this._config[task.year] = { tasks: {}, dirname: String(task.year) };

    this._config[task.year].tasks[`${task.day}`.padStart(2, "0")] = {
      lang: task.template,
      dirname: path.relative(
        path.join(this.getRoot(), this._config[task.year].dirname),
        task.getPath()
      ),
    };
  }
}

export class ConfigParser {
  private getConfigPath(): string | null {
    let currentPath = process.cwd();

    while (currentPath !== path.join(currentPath, "..")) {
      const configPath = path.join(currentPath, ".scafconfig");
      if (fs.existsSync(configPath)) return configPath;
      currentPath = path.join(currentPath, "..");
    }

    return null;
  }

  static parse(): Config {
    const cfgPath = new ConfigParser().getConfigPath();

    if (!cfgPath) {
      return new Config(path.join(process.cwd(), ".scafconfig"), {});
    }

    const data = fs.readFileSync(cfgPath, "utf-8");
    return new Config(cfgPath, ConfigSchema.parse(toml.parse(data)));
  }

  static write(config: Config) {
    fs.writeFileSync(config.getPath(), toml.stringify(config.getRawConfig()));
  }
}
