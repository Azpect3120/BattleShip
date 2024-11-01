/**
 * Coordinate class represents a point in 2D space.
 * This class is used to represent the starting and ending 
 * coordinates of a cell.
 */
export class Coordinate {
  /**
   * X coordinate.
   * Unit agnostic.
  */
  x: number;

  /**
   * Y coordinate.
   * Unit agnostic.
  */
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Cell class represents a single cell in the gameboard.
 * A cell is a square on the gameboard that can contain a game piece.
 */
export class Cell {
  /**
   * Starting coordinate of the cell.
   * This is the top-left corner of the cell.
   * Unit: px
  */
  a: Coordinate;

  /**
   * Ending coordinate of the cell.
   * This is the bottom-right corner of the cell.
   * Unit: px
  */
  b: Coordinate;

  constructor(a: Coordinate, b: Coordinate) {
    this.a = a;
    this.b = b;
  }
}
