import {describe, it, expect} from "vitest"
import { partOne } from "./main";
//**scaf**|import { partTwo } from "./main";

describe("Task {{DAY}}/{{YEAR}}", () => {
  it("test part one", () => {
    const input = `{{INPUT_1}}`.split("\n");

    expect(partOne(input)).toBe({{ANSWER_1}});
  });

  //**scaf**|it("test part twp", () => {
  //**scaf**|  const input = `{{INPUT_2}}`.split("\n");
  //**scaf**|
  //**scaf**|  expect(partTwo(input)).toBe({{ANSWER_2}});
  //**scaf**|});
});
