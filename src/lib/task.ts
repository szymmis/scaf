export class Task {
  day: number;
  year: number;
  template: string;
  private path: string;

  constructor(day: number, year: number, template: string, path: string) {
    this.day = day;
    this.year = year;
    this.template = template;
    this.path = path;
  }

  getPath(): string {
    return this.path;
  }
}
