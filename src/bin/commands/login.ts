import { createInterface } from "readline";

import { Colors } from "../../lib/colors";
import { TokenManager } from "../../lib/token";

export default async function login() {
  const token = await TokenManager.getToken();

  if (token) {
    console.log(Colors.paint(Colors.Green, "You are already logged in."));
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Please enter your session token:\n", async (token) => {
    if (!token.trim()) {
      console.log(Colors.paint(Colors.Red, "Token cannot be an empty string."));
      process.exit(1);
    }

    await TokenManager.saveToken(token.trim());
    console.log(
      Colors.paint(
        Colors.Green,
        token ? "Token updated successfully." : "Token saved successfully."
      )
    );

    rl.close();
  });
}
