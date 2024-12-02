import { Data } from "@geraintguan/ts-std-lib";
import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";

async function main(args: string[]) {
  const filePath = resolve(process.cwd(), args[2]);

  console.log(`Loading input from file: ${filePath}`);

  const fileData = await readFile(filePath, "ascii");
  const fileLines = fileData.split(EOL);

  const columns: [number[], number[]] = [[], []];

  for (const line of fileLines) {
    const [l, _, r] = line.split(/( )+/);
    columns[0].push(parseInt(l, 10));
    columns[1].push(parseInt(r, 10));
  }

  columns[0].sort();
  columns[1].sort();

  let total = 0;

  for (let i = 0; i < columns[0].length; i++) {
    total += Math.abs(columns[0][i] - columns[1][i]);
  }

  console.log(`Part 1: ${total}`);

  let score = 0;

  const occurrencesMap = columns[1].reduce(
    (map, next) => {
      map.set(next, map.get(next) + 1);

      return map;
    },
    Data.DefaultMap.empty<number, number>({
      defaultValue: { type: "value", value: 0 },
    }),
  );

  for (const l of columns[0]) {
    score += l * occurrencesMap.get(l);
  }

  console.log(`Part 2: ${score}`);
}

await main(process.argv);
