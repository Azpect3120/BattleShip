import { Coordinate } from './cell.js';

export enum Ships {
  Carrier,
  Battleship,
  Cruiser,
  Submarine,
  Destroyer,
};

export enum Direction {
  Horizontal,
  Vertical,
}

const SHIP_MAP: Map<Ships, number> = new Map<Ships, number>([
  [Ships.Carrier, 5],
  [Ships.Battleship, 4],
  [Ships.Cruiser, 3],
  [Ships.Submarine, 3],
  [Ships.Destroyer, 2],
]);

export class Ship {
  /**
   * The size of the ship. The size is the number of cells the 
   * ship occupies. This value is defined by the `SHIP_MAP` and
   * is immutable. This value is set when constructing the ship.
   */
  private size_p: number = 0;

  /**
   * The type of the ship. This value is immutable once set.
   */
  private type_p: Ships;

  /**
   * This is a useful value to have. It is defined by the difference 
   * in the x or y coordinates of the start and end coordinates.
   * This value is immutable once set in the constructor.
   */
  private direction_p: Direction;

  /**
   * This defines the starting coordinate of the ship.
   * The TAIL end of the ship. This uses the `Coordinate` class
   * with the unit of cells.
   */
  start: Coordinate;

  /**
   * This defines the ending coordinate of the ship.
   * The HEAD end of the ship. This uses the `Coordinate` class
   * with the unit of cells.
   */
  end: Coordinate;


  /**
   * Creates a new ship. If the coordinates are invalid, an error is thrown.
   */
  constructor(type: Ships, start: Coordinate, end: Coordinate) {
    this.type_p = type;
    this.size_p = SHIP_MAP.get(type) || 0;

    this.start = start;
    this.end = end;

    // Set the direction
    if (start.x === end.x) {
      this.direction_p = Direction.Vertical;
    } else if (start.y === end.y) {
      this.direction_p = Direction.Horizontal;
    } else {
      throw new Error("Invalid ship coordinates");
    }
  }

  /**
   * Returns the type of the ship. This might be useless.
   */
  type(): Ships {
    return this.type_p;
  }

  /**
   * Returns the size of the ship.
   */
  size(): number {
    return this.size_p;
  }

  /**
   * Returns the direction of the ship.
   */
  direction(): Direction {
    return this.direction_p;
  }

  /**
   * If the target coordinate intersects with the ship, return true.
   */
  intersects(target: Coordinate): boolean {
    // Ship direction to simplify the logic
    if (this.direction_p === Direction.Vertical) {
      // The target is on the same vertical line as the ship
      if (target.x === this.start.x) {
        if (target.y >= this.start.y && target.y <= this.end.y) {
          return true;
        }
      }
    } else if (this.direction_p === Direction.Horizontal) {
      // The target is on the same horizonta line as the ship
      if (target.y === this.start.y) {
        if (target.x >= this.start.x && target.x <= this.end.x) {
          return true;
        }
      }
    }
    return false;
  }

}
