import { createSolver } from "../utils/createSolver.js";

class Vector2D {
  constructor(public x: number, public y: number) {}

  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  addMut(other: Vector2D): this {
    const added = this.add(other);

    this.x = added.x;
    this.y = added.y;

    return this;
  }

  copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  rotate(angle: number): Vector2D {
    const rad = (angle * Math.PI) / 180;

    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return new Vector2D(
      Math.round(this.x * cos - this.y * sin),
      Math.round(this.x * sin + this.y * cos),
    );
  }

  rotateMut(angle: number): this {
    const rotated = this.rotate(angle);

    this.x = rotated.x;
    this.y = rotated.y;

    return this;
  }

  toString(): string {
    return `Vector2D { x: ${this.x}, y: ${this.y} }`;
  }
}

class Guard {
  constructor(public position: Vector2D, public direction: Vector2D) {}

  move(): Guard {
    return new Guard(this.position.add(this.direction), this.direction);
  }

  moveMut(): this {
    this.position.addMut(this.direction);

    return this;
  }

  copy(): Guard {
    return new Guard(this.position.copy(), this.direction.copy());
  }

  turn(angle: number) {
    return new Guard(this.position, this.direction.rotate(angle));
  }

  turnMut() {
    this.direction.rotateMut(90);
  }

  toString(): string {
    return `Guard { position: ${this.position}, direction: ${this.direction} }`;
  }
}

class Map {
  static fromLines(lines: string[]): Map {
    const guard = new Guard(new Vector2D(0, 0), new Vector2D(0, -1));
    const grid = lines.map((line) => line.split(""));

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "^") {
          guard.position = new Vector2D(x, y);
        }
      }
    }

    return new Map(grid, guard);
  }

  constructor(public grid: string[][], public guard: Guard) {}

  at(coord: Vector2D): string | null {
    if (!this.isInBounds(coord)) return null;

    return this.grid[coord.y][coord.x];
  }

  setMut(coord: Vector2D, value: string): this {
    if (!this.isInBounds(coord)) return this;

    this.grid[coord.y][coord.x] = value;

    return this;
  }

  debug() {
    console.log("--------------------");
    console.log(this.guard.toString());
    console.log(this.toString());
    console.log("--------------------");
  }

  toString(): string {
    return this.grid.map((r) => r.join("")).join("\n");
  }

  simulate(): Map {
    const map = new Map(
      this.grid.map((r) => [...r]),
      this.guard.copy(),
    );

    while (map.isInBounds(map.guard.position)) {
      const positionInFront = map.guard.move().position;

      if (map.at(positionInFront) === "#") {
        map.guard.turnMut();
      } else {
        map.setMut(map.guard.position, "X");
        map.guard.moveMut();
      }
    }

    return map;
  }

  clearWalkedSquaresMut(): this {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.at(new Vector2D(x, y)) === "X") {
          this.setMut(new Vector2D(x, y), ".");
        }
      }
    }

    return this;
  }

  findObstacleMapVariations(guardStart: Guard): Map[] {
    const maps: Map[] = [];

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const position = new Vector2D(x, y);

        if (this.at(position) === "X") {
          const newMap = new Map(
            this.grid.map((r) => [...r]),
            guardStart.copy(),
          );

          newMap
            .clearWalkedSquaresMut()
            .setMut(position, "O")
            .setMut(guardStart.position, "^");

          maps.push(newMap);
        }
      }
    }

    return maps;
  }

  simulateWithLoopDetection(): boolean {
    const map = new Map(
      this.grid.map((r) => [...r]),
      this.guard.copy(),
    );

    while (true) {
      const positionInFront = map.guard.move().position;

      if (parseInt(map.at(map.guard.position) ?? "0", 10) === 5) {
        return true;
      }

      if (!map.isInBounds(map.guard.position)) {
        return false;
      }

      if (map.at(positionInFront) === "#" || map.at(positionInFront) === "O") {
        map.guard.turnMut();
      } else {
        const value = parseInt(map.at(map.guard.position) ?? "0", 10);

        map.setMut(
          map.guard.position,
          ((isNaN(value) ? 0 : value) + 1).toString(),
        );

        map.guard.moveMut();
      }
    }
  }

  isInBounds(coord: Vector2D): boolean {
    return (
      coord.x >= 0 &&
      coord.x < this.grid[0].length &&
      coord.y >= 0 &&
      coord.y < this.grid.length
    );
  }

  countWalkedSquares(): number {
    return this.grid.flat().filter((v) => v === "X").length;
  }
}

export const main = createSolver(async (lines) => {
  const inputMap = Map.fromLines(lines);
  const simulatedMap = inputMap.simulate();

  console.log("Part 1: ", simulatedMap.countWalkedSquares());

  const loops = simulatedMap
    .findObstacleMapVariations(inputMap.guard)
    .map((map) => map.simulateWithLoopDetection())
    .reduce((total, next) => total + (next ? 1 : 0), 0);

  console.log("Part 2: ", loops);
});

await main();
