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
        /**
         * Whether the cell is selected by the user.
         */
        this.selected = false;
        /**
         * Whether the cell contains a ship.
         */
        this.ship = false;
        this.a = a;
        this.b = b;
    }
    is_selected() {
        return this.selected;
    }
    /**
     * Select this cell.
     */
    select() {
        this.selected = true;
    }
    /**
     * Deselect this cell.
     */
    deselect() {
        this.selected = false;
    }
    /**
     * Toggle the selection state of this cell.
     * If the cell is selected, deselect it.
     * If the cell is not selected, select it.
     */
    toggle_select() {
        this.selected = !this.selected;
    }
    /**
     * Check if the cell contains a ship.
     */
    is_ship() {
        return this.ship;
    }
    /**
     * Place a ship in this cell.
     */
    place_ship() {
        this.ship = true;
    }
}
