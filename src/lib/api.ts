import { Colors } from "./colors";
import { Logger } from "./logger";
import { TokenManager } from "./token";

const API_URL = `https://adventofcode.com/`;

export class Api {
  static async getApiKey() {
    const key = await TokenManager.getToken();
    if (!key) {
      Logger.panic(
        "Unable to read the token.",
        `Use ${Colors.paint(
          Colors.Yellow,
          "scaf login"
        )} to authorize or setup ${Colors.paint(
          Colors.Yellow,
          TokenManager.TOKEN_ENV
        )} env variable.`
      );
    }
    return key;
  }

  private static async fetch(url: string) {
    const headers = new Headers();
    headers.append("cookie", `session=${await this.getApiKey()}`);
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new HttpError(
        `Failed to fetch ${url}: ${response.statusText}` +
          (await response.text()),
        response.status
      );
    }

    return response.text();
  }

  private static getURL(path: string): string {
    return new URL(path, API_URL).toString();
  }

  static getTaskURL(year: number, day: number): string {
    return this.getURL(`${year}/day/${day}`);
  }

  static async fetchPuzzle(year: number, day: number): Promise<string> {
    return this.fetch(this.getURL(this.getTaskURL(year, day)));
  }

  static async fetchPuzzleInput(year: number, day: number): Promise<string> {
    return this.fetch(this.getURL(`${year}/day/${day}/input`));
  }
}

export class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}
