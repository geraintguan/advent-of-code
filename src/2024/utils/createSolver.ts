import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";

export type Solver = () => Promise<void>;

export type SolverHandler = (lines: string[]) => Promise<void>;

export function createSolver(handler: SolverHandler): Solver {
  return async () => {
    const args = process.argv;
    const filePath = resolve(process.cwd(), args[2]);

    console.log(`Loading input from file: ${filePath}`);

    const fileData = await readFile(filePath, "ascii");
    const fileLines = fileData.split(EOL);

    return handler(fileLines);
  };
}
