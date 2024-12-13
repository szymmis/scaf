export class MissingTaskError extends Error {
  constructor(public day: number, public year: number) {
    super(`Task ${day}/${year} not found in .scafconfig`);
  }
}

export class NoTaskInCwdError extends Error {
  constructor() {
    super(`No task found in current working directory`);
  }
}

export class TaskAlreadyExistsError extends Error {
  constructor(public day: number, public year: number) {
    super(`Task ${day}/${year} already exists`);
  }
}
