import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";

function pullAt<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array;
  }

  return [...array.slice(0, index), ...array.slice(index + 1, array.length)];
}

function checkReport(report: number[]): boolean {
  const diffs: number[] = [];

  for (let i = 0; i < report.length - 1; i++) {
    diffs.push(report[i + 1] - report[i]);
  }

  if (!diffs.every((v) => v < 0) && !diffs.every((v) => v > 0)) {
    return false;
  }

  if (diffs.some((v) => Math.abs(v) > 3)) {
    return false;
  }

  return true;
}

function withoutOneLevelVariations(report: number[]): number[][] {
  return report.map((_, i) => pullAt(report, i));
}

async function main(args: string[]) {
  const filePath = resolve(process.cwd(), args[2]);

  console.log(`Loading input from file: ${filePath}`);

  const fileData = await readFile(filePath, "ascii");
  const fileLines = fileData.split(EOL);

  const reports = fileLines.map((line) =>
    line.split(" ").map((str) => parseInt(str, 10)),
  );

  let totalSafe = 0;

  for (const report of reports) {
    if (checkReport(report)) {
      totalSafe++;
    }
  }

  console.log(`Part 1: ${totalSafe}`);

  let totalSafeWithDampener = 0;

  for (const report of reports) {
    if (
      checkReport(report) ||
      withoutOneLevelVariations(report).some(checkReport)
    ) {
      totalSafeWithDampener++;
    }
  }

  console.log(`Part 2: ${totalSafeWithDampener}`);
}

await main(process.argv);
