# 🏗️ scaf

> A simple tool for scaffolding Advent of Code tasks

[![npm](https://img.shields.io/npm/v/@szymmis/scaf)](https://www.npmjs.org/package/@szymmis/scaf)
[![downloads-per-week](https://img.shields.io/npm/dt/@szymmis/scaf?color=success)](https://www.npmjs.org/package/@szymmis/scaf)
[![license](https://img.shields.io/npm/l/@szymmis/scaf?color=purple)](https://www.npmjs.org/package/@szymmis/scaf)

## 🤔 Why Scaf?

[**Advent of Code**](https://adventofcode.com) is fun, but setting up tasks every day can be tedious. **scaf** simplifies this by automating the setup, letting you focus on solving puzzles. It does this by fetching task info directly from the website and creating a directory structure and files for the task, including the input data file.
You can select from [multiple languages](./templates/), as long as there is a template for that.

## 🚀 Usage

### Installation

Install **scaf** globally using npm to make it accessible as a CLI tool:

```bash
npm install -g @szymmis/scaf
```

### Authorizing into the AoC

- Go to the [Advent of Code](https://adventofcode.com/auth/login) website and login
- Open browser devtools and copy `session` cookie value
- Use `scaf login` command or setup the env variable `SCAF_TOKEN=<value>` in your shell

### Scaffolding a task

Use the **init** command to create a new task's folder and files for a specific day and programming language:

```bash
scaf init <lang> <year>/<day>
```

- `lang`: The programming language you want to use (e.g., `go`, `rust`, `py`).
- `year/day`: The Advent of Code year and day to scaffold (e.g., `2023/01`).

### Advancing to the second part

When you’re ready to tackle part two of the day's puzzle, use the `advance` command:

```bash
scaf advance <year/day>
```

- `year/day`: The year and day of the task you're advancing (e.g., `2023/01`).

This command generates the necessary files or updates your workspace to prepare for solving part two.

## ⚖️ License

[MIT](./LICENSE)
