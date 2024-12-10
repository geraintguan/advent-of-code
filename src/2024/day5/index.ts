import { Data } from "@geraintguan/ts-std-lib";
import { createSolver } from "../utils/createSolver.js";

function isValidPage(
  rules: Data.DefaultMap<number, Set<number>>,
  page: string,
): boolean {
  const seq = page.split(",").map((v) => parseInt(v, 10));
  const seen = [seq[0]];

  for (let i = 1; i < seq.length; i++) {
    const invalid = seen.filter((v) => rules.get(seq[i]).has(v)).length > 0;

    if (invalid) {
      return false;
    }

    seen.push(seq[i]);
  }

  return true;
}

export const main = createSolver(async (lines) => {
  const sectionSplitIndex = lines.findIndex((l) => l === "");
  const rules = lines.slice(0, sectionSplitIndex);
  const pages = lines.slice(sectionSplitIndex + 1);

  const rulesMap = Data.DefaultMap.empty<number, Set<number>>({
    defaultValue: {
      type: "function",
      value: () => new Set<number>(),
    },
  });

  for (const rule of rules) {
    const [key, value] = rule.split("|");

    rulesMap.get(parseInt(key, 10)).add(parseInt(value, 10));
  }

  const correctPages = pages.filter((page) => isValidPage(rulesMap, page));

  console.log(
    "Part 1: ",
    correctPages
      .map((page) => page.split(","))
      .map((page) => page[Math.floor(page.length / 2)])
      .map((v) => parseInt(v, 10))
      .reduce((a, b) => a + b),
  );

  let incorrectTotal = 0;
  const incorrectPages = pages.filter((page) => !isValidPage(rulesMap, page));

  for (const page of incorrectPages) {
    let seq = page.split(",").map((v) => parseInt(v, 10));

    while (!isValidPage(rulesMap, seq.join(","))) {
      for (let i = 1; i < seq.length; i++) {
        const invalids = seq
          .slice(0, i)
          .filter((v) => rulesMap.get(seq[i]).has(v));

        if (invalids.length > 0) {
          seq = [...seq.splice(i, 1), ...seq];
        }
      }
    }

    incorrectTotal += seq[Math.floor(seq.length / 2)];
  }

  console.log("Part 2: ", incorrectTotal);
});

await main();
