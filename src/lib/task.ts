import path from "path";
import { Template } from "./template";

export class Task {
  day: number;
  year: number;
  template: Template;
  private path: string;

  constructor(day: number, year: number, lang: string, path: string) {
    this.day = day;
    this.year = year;
    this.template = Template.fromString(lang);
    this.path = path;
  }

  getPath(): string {
    return this.path;
  }

  getInputPath(): string {
    return path.join(this.getPath(), "input.txt");
  }
}
