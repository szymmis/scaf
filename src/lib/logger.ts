import { Colors } from "./colors";

export class Logger {
  static log(msg: string) {
    console.log(`[LOG] ${msg}`);
  }

  static panic(msg: string, hint?: string) {
    console.log(
      `${Colors.paint(Colors.Red, "err: " + msg)}\n${
        hint ? `${Colors.paint(Colors.Gray, "Hint:")} ${hint}` : ""
      }`
    );
    process.exit(1);
  }
}

export function log(msg: string) {
  console.log(`[LOG] ${msg}`);
}
