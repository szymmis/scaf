const API_URL = `https://www.adventofcode.com/`;

export class Api {
  static getApiKey(): string {
    const key = Bun.env["AOC_API_KEY"];
    if (!key) throw new Error("AOC_API_KEY env var is missing!");
    return key;
  }

  private static async fetch(url: string) {
    const headers = new Headers();
    headers.append("Cookie", `session=${this.getApiKey()}`);
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new HttpError(
        `Failed to fetch ${url}: ${response.statusText}`,
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
