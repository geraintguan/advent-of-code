import { createSolver } from "../utils/createSolver.js";

function isSolvable(line: string): number {
  const [tokenTarget, ...tokens] = line.split(" ");
  const target = parseInt(tokenTarget.slice(0, tokenTarget.length - 1), 10);
  const components = tokens.map(t => parseInt(t, 10));

  const stack: { t: number, c: number[] }[] = [{
    t: components[0], c: components.slice(1),
  }];

  do {
    const item = stack.pop();

    if (!item) continue;

    const { t, c } = item;

    if (t == target) return t;
    if (c.length < 1) continue;

    stack.push(
      { t: t + c[0], c: c.slice(1) },
      { t: t * c[0], c: c.slice(1) }
    );

  } while (stack.length > 0)

  return 0; 
}

function isSolvable2(line: string): number {
  const [tokenTarget, ...tokens] = line.split(" ");
  const target = parseInt(tokenTarget.slice(0, tokenTarget.length - 1), 10);
  const components = tokens.map(t => parseInt(t, 10));

  const stack: { t: number, c: number[] }[] = [{
    t: components[0], c: components.slice(1),
  }];

  do {
    const item = stack.pop();

    if (!item) continue;

    const { t, c } = item;

    if (t == target && c.length == 0) {
      return t;
    }
    if (t > target) continue;
    if (c.length < 1) continue;

    stack.push(
      { t: t + c[0], c: c.slice(1) },
      { t: t * c[0], c: c.slice(1) },
      { t: parseInt(`${t}${c[0]}`, 10), c: c.slice(1) },
    );

  } while (stack.length > 0)

  return 0; 
}

export const main = createSolver(async (lines) => {
  console.log("Part 1: ", lines
    .slice(0, lines.length - 1)
    .map(isSolvable)
    .reduce((a, b) => a + b));
  console.log("Part 2: ", lines
    .slice(0, lines.length - 1)
    .map(isSolvable2)
    .reduce((a, b) => a + b));
});

await main();
