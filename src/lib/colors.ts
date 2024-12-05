export class Colors {
  static Black = 30;
  static Red = 31;
  static Green = 32;
  static Yellow = 33;
  static Blue = 34;
  static Magenta = 35;
  static Cyan = 36;
  static White = 37;
  static Gray = 90;

  static paint(color: number, message: string) {
    return process.stdout.isTTY || process.env.FORCE_COLOR
      ? `\u001b[${[color]}m${message}\u001b[0m`
      : message;
  }
}
