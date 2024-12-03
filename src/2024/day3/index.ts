import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";

async function main(args: string[]) {
  const filePath = resolve(process.cwd(), args[2]);

  console.log(`Loading input from file: ${filePath}`);

  const fileData = await readFile(filePath, "ascii");
  const fileLines = fileData.split(EOL);

  let total = 0;

  for (const [match] of fileLines.join("").matchAll(/mul\([0-9]+,[0-9]+\)/g)) {
    const [[strA], [strB]] = match.matchAll(/[0-9]+/g);
    const a = parseInt(strA, 10);
    const b = parseInt(strB, 10);

    total += a * b;
  }

  console.log(`Part 1: ${total}`);

  let total2 = 0;
  let enabled = true;

  for (const [match] of fileLines
    .join("")
    .matchAll(/(mul\([0-9]+,[0-9]+\))|(do\(\))|(don't\(\))/g)) {
    if (match.startsWith("mul")) {
      const [[strA], [strB]] = match.matchAll(/[0-9]+/g);
      const a = parseInt(strA, 10);
      const b = parseInt(strB, 10);

      if (enabled) {
        total2 += a * b;
      }
    } else if (match === "do()") {
      enabled = true;
    } else if (match === "don't()") {
      enabled = false;
    }
  }

  console.log(`Part 2: ${total2}`);
}

await main(process.argv);
