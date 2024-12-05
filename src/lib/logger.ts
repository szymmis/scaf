import { Colors } from "./colors";

export class Logger {
  static info(msg: string) {
    console.log(`${Colors.gray("info: " + msg)}`);
  }

  static log(msg: string) {
    console.log(`${msg}`);
  }

  static success(msg: string) {
    console.log(`${Colors.green(msg)}`);
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
