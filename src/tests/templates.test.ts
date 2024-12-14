import os from "os";
import path from "path";
import fs from "fs/promises";
import { describe, it, expect, vi } from "vitest";
import init from "../bin/commands/init";
import advance from "../bin/commands/advance";
import { Cache } from "../lib/cache";
import { Parsers } from "../bin/parsers";

describe.each(await fs.readdir(path.join(__dirname, "../../templates")))(
  "Test '%s' template",
  async (lang: string) => {
    const cwd = await fs.mkdtemp(os.tmpdir() + path.sep);

    it("can init template", async () => {
      console.log = () => {};
      process.cwd = () => cwd;

      await fs.cp(
        path.join(__dirname, "env/.cache"),
        path.join(cwd, ".cache"),
        { recursive: true }
      );

      await init({ day: 1, year: 2021 }, { lang, open: false });
    });

    it("copies all files", async () => {
      const expectedFiles = [
        ".gitignore",
        "input.txt",
        ...(await fs.readdir(`templates/${lang}`)).filter(
          (f) => f !== "_gitignore" && f !== ".template"
        ),
      ];

      const output = await fs.readdir(path.join(cwd, "2021/01"));
      expect(output.sort()).toEqual(expectedFiles.sort());
    });

    it("creates .scafconfig", async () => {
      const output = await fs.readFile(path.join(cwd, ".scafconfig"), "utf-8");

      expect(output).toEqual(
        `[2021]\ndirname = \"2021\"\n\n[2021.tasks]\n[2021.tasks.01]\nlang = \"${lang}\"\ndirname = \"01\"`
      );
    });

    it("can advance to part two", async () => {
      Cache.loadTask = vi
        .fn()
        .mockImplementation(async () =>
          fs.readFile(path.join(cwd, ".cache/2021_01.html"), "utf-8")
        );

      await advance(Parsers.parseTask({ day: 1, year: 2021 }), { open: false });
    });

    it("removes all comments", async () => {
      const files = await fs.readdir(path.join(cwd, "2021/01"), {
        recursive: true,
      });

      for (const file of files) {
        if (path.extname(file)) {
          expect(
            await fs.readFile(path.join(cwd, "2021/01", file), "utf-8")
          ).not.toContain("//**scaf**|");
        }
      }
    });
  }
);
