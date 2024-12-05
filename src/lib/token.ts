import os from "os";
import path from "path";
import fs from "fs/promises";

export class TokenManager {
  static TOKEN_ENV = "SCAF_TOKEN";

  static getTokenPath() {
    return path.join(os.homedir(), ".scaftoken");
  }

  static async getToken() {
    if (process.env[this.TOKEN_ENV]) return process.env[this.TOKEN_ENV];
    try {
      return await fs.readFile(this.getTokenPath(), "utf-8");
    } catch {
      return null;
    }
  }

  static async saveToken(token: string) {
    await fs.writeFile(this.getTokenPath(), token);
  }
}
