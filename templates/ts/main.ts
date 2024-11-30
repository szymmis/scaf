import fs from "fs";

export function partOne(input: string): number {
  return -1;
}

//**scaf**|export function partTwo(input: string): number {
//**scaf**|  return -1;
//**scaf**|}

function main() {
  const input = fs.readFileSync("input.txt", "utf-8");
  console.log("Part One:", partOne(input));
  //**scaf**|console.log("Part Two:", partTwo(input));
}

if (require.main === module) {
  main();
}
