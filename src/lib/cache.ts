import fs from "fs";
import path from "path";
import { log } from "./logger";
import { Formatter } from "./formatter";
import { Api } from "./api";
import { Task } from "./task";

const CACHE_DIRNAME = ".cache";

export class Cache {
  private static exists(fileName: string): boolean {
    if (!fs.existsSync(CACHE_DIRNAME)) fs.mkdirSync(CACHE_DIRNAME);
    const filePath = path.join(CACHE_DIRNAME, fileName);
    return fs.existsSync(filePath);
  }

  private static load(fileName: string): string | undefined {
    if (this.exists(fileName)) {
      log(`Reading ${fileName} from cache.`);
      return fs.readFileSync(path.join(CACHE_DIRNAME, fileName), "utf8");
    } else {
      log(`${fileName} not found in cache.`);
      return undefined;
    }
  }

  private static save(fileName: string, data: string) {
    const filePath = path.join(CACHE_DIRNAME, fileName);

    fs.writeFileSync(filePath, data, "utf8");
    log(`${fileName} saved to cache`);
  }

  static async loadTask(task: Task, force?: boolean) {
    const fileName = `${Formatter.getTaskFileName(task.year, task.day)}.html`;

    if (!force && this.exists(fileName)) {
      return this.load(fileName) as string;
    }

    const puzzle = await Api.fetchPuzzle(task.year, task.day);
    Cache.save(fileName, puzzle);

    return puzzle;
  }

  static async loadTaskInput(task: Task, force?: boolean) {
    const fileName = `${Formatter.getTaskFileName(task.year, task.day)}.txt`;

    if (!force && this.exists(fileName)) {
      return this.load(fileName) as string;
    }

    const puzzle = await Api.fetchPuzzleInput(task.year, task.day);
    Cache.save(fileName, puzzle);

    return puzzle;
  }
}
