export class MissingTaskError extends Error {
  constructor(public day: number, public year: number) {
    super(`Task ${day}/${year} not found in .scafconfig`);
  }
}
