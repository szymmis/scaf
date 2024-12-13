import { Colors } from "../lib/colors";
import { ConfigParser } from "../lib/config";
import { MissingTaskError, NoTaskInCwdError } from "../lib/errors";
import { Logger } from "../lib/logger";
import { Task } from "../lib/task";

function parseTaskNumber(task: string) {
  if (task && !task.match(/^\d{1,2}(\/?(20)?\d{2})?$/)) {
    Logger.panic(
      "Invalid task number format.",
      `Correct formats: ${Colors.yellow("1")}, ${Colors.yellow(
        "3/24"
      )} or ${Colors.yellow("5/2024")}.`
    );
  }

  const date = new Date();
  let [day = date.getDate(), year = date.getFullYear()] = task
    .split("/")
    .map(Number);
  year = year < 2000 ? year + 2000 : year;

  if (year === date.getFullYear()) {
    if (date.getMonth() !== 11) {
      Logger.panic(
        `Advent of Code ${year} hasn't started yet.`,
        `It starts on ${Colors.yellow("1st")} December`
      );
    } else {
      if (day > date.getDate() && day <= 25) {
        Logger.panic(
          `Task ${day} is not yet available.`,
          `Time travel was not invented yet.`
        );
      }
    }
  }

  if (day < 1 || day > 25) {
    Logger.panic(
      `${day} is an invalid day.`,
      `Advent lasts from ${Colors.yellow("1st")} to ${Colors.yellow(
        "25th"
      )} December.`
    );
  }

  if (year < 2015 || year > date.getFullYear()) {
    Logger.panic(
      `${year} is an invalid year.`,
      `Advent of Code started in ${Colors.yellow("2015")}.`
    );
  }

  return { day, year };
}

function parseTask(params?: { day: number; year: number }) {
  const config = ConfigParser.parse();

  let task: Task | null = null;

  if (!params) {
    task = config.getTaskByPath(process.cwd());
  } else {
    task = config.getTask(params.day, params.year);
  }

  if (!task) {
    if (params) throw new MissingTaskError(params.day, params.year);
    else throw new NoTaskInCwdError();
  }

  return task;
}

export const Parsers = {
  parseTaskNumber,
  parseTask,
};
