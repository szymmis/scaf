import fs from "fs/promises";

const output = await Bun.build({
  entrypoints: ["src/bin/index.ts"],
  outdir: "dist",
  target: "node",
});

if (!output.success) {
  console.error(output.logs);
  process.exit(1);
}

const text = await fs.readFile("dist/index.js", "utf-8");

await fs.writeFile(
  "dist/index.js",
  `#!/usr/bin/env node\n\n${text}`.replace(
    /var TEMPLATE_DIR = .*/,
    "const TEMPLATE_DIR = path.join(import.meta.dirname, 'templates')"
  ),
  "utf-8"
);

await fs.cp("src/templates", "dist/templates", { recursive: true });
