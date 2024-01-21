export class Formatter {
  static getTaskFileName(year: number, day: number): string {
    return `${year}_${day.toString().padStart(2, "0")}`;
  }
}
