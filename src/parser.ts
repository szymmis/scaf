import { load } from "cheerio";

export class Parser {
  static async parseTask(htmlString: string) {
    const $ = load(htmlString);

    const hasPartTwo = Boolean($("h2#part2").text().trim());

    const examples = $("p")
      .filter(function () {
        return /(for|an) example/i.test($(this).text());
      })
      .next("pre:has(code)")
      .toArray()
      .map(function (el) {
        return $(el).text().trim();
      });

    const answers = $("article.day-desc")
      .toArray()
      .map((el) =>
        $(el)
          .find("code > em")
          .toArray()
          .map((el) => $(el).text())
          .pop()
      );

    return { examples, answers, hasPartTwo };
  }
}
