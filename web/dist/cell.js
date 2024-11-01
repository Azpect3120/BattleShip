/**
 * Coordinate class represents a point in 2D space.
 * This class is used to represent the starting and ending
 * coordinates of a cell.
 */
export class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Cell class represents a single cell in the gameboard.
 * A cell is a square on the gameboard that can contain a game piece.
 */
export class Cell {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}
