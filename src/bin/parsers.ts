function parseTaskNumber(task: string) {
  if (task && !task.match(/^\d{1,2}(\/?(20)?\d{2})?$/)) {
    throw new Error(
      "Invalid task number format, use <dd>, <dd/yy> or <dd/YYYY>. Example: 1, 3/15 or 5/2020"
    );
  }

  const date = new Date();
  const [day = date.getDate(), year = date.getFullYear()] = task
    .split("/")
    .map(Number);
  return { day, year: year < 100 ? year + 2000 : year };
}

export const Parsers = {
  parseTaskNumber,
};
