import { createSolver } from "../utils/createSolver.js";

function columns(rows: string[]): string[] {
  return rows.map((row, i) => rows.map((row) => row[i]).join(""));
}

function diagonalsNorthEast(rows: string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    let diagonal = "";

    for (let j = 0; j < rows.length - i; j++) {
      diagonal += rows[j][i + j];
    }

    result.push(diagonal);
  }

  for (let i = 1; i < rows.length; i++) {
    let diagonal = "";
    for (let j = 0; j < rows.length - i; j++) {
      diagonal += rows[i + j][j];
    }
    result.push(diagonal);
  }

  return result;
}

function diagonalsNorthWest(rows: string[]): string[] {
  return diagonalsNorthEast(
    rows.map((row) => row.split("").reverse().join("")),
  );
}

function countMatches(seq: string): number {
  return (
    Array.from(seq.matchAll(/XMAS/g)).length +
    Array.from(seq.matchAll(/SAMX/g)).length
  );
}

export const main = createSolver(async (rows) => {
  console.log(
    "Part 1: ",
    [
      ...rows,
      ...columns(rows),
      ...diagonalsNorthEast(rows),
      ...diagonalsNorthWest(rows),
    ]
      .map(countMatches)
      .reduce((a, b) => a + b),
  );

  let count2 = 0;

  for (let i = 1; i < rows.length - 1; i++) {
    for (let j = 1; j < rows[i].length - 1; j++) {
      if (rows[i][j] !== "A") continue;

      const charNW = rows[i - 1][j - 1];
      const charNE = rows[i - 1][j + 1];
      const charSW = rows[i + 1][j - 1];
      const charSE = rows[i + 1][j + 1];

      const strNWSE = `${charNW}${rows[i][j]}${charSE}`;
      const strNESW = `${charNE}${rows[i][j]}${charSW}`;

      if (
        (strNWSE === "MAS" || strNWSE === "SAM") &&
        (strNESW === "MAS" || strNESW === "SAM")
      ) {
        count2++;
      }
    }
  }

  console.log("Part 2: ", count2);
});

main();
