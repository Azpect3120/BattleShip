import { Cell, Coordinate } from "./cell.js";
import { Direction } from "./data.js";
/** Gameboard class. Stores data regarding the gameboard and provides methods to draw the gameboard to the canvas.
 */
export class Gameboard {
    /**
     * Constructor for the Gameboard class.
     * @param width Width of the gameboard, in pixels.
     * @param height Height of the gameboard, in pixels.
     * @param ctx Context used to draw to the canvas.
     */
    constructor(canvas, ctx) {
        /**
         * Size of the gameboard.
         * Default is 0.
         * Unit: px
         */
        this.width = 0;
        this.height = 0;
        /**
         * Color of the gameboard and grid.
         */
        this.color = "white";
        this.active_color = "red";
        /**
         * Number of cells in the gameboard.
         * This value defines the height and width.
         */
        this.cell_count = 10;
        /**
         * Height of each cell in the gameboard.
         * Unit: px
         */
        this.cell_height = this.height / this.cell_count;
        /**
         * Width of each cell in the gameboard.
         * Unit: px
         */
        this.cell_width = this.width / this.cell_count;
        /**
         * Stores the ships on the gameboard. The ships are looped through to determine
         * if a ship is hit or not. They are also used to draw the ships on the board.
         */
        this.ships = [];
        /**
         * Last cell hovered by the user. Used to un-highlight the cell when the user
         * moves the mouse.
         */
        this.last_hovered_cell = null;
        /**
         * Whether the user is dragging. Used to determine if the user is dragging
         * the mouse to allow for selections. Might remove the 'paint' feature.
         */
        this.dragging = false;
        /**
         * Whether the use is dragging to paint or to erase.
         */
        this.dragging_active = false;
        this.ctx = ctx;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cell_height = this.height / this.cell_count;
        this.cell_width = this.width / this.cell_count;
        this.cell_data = [];
        let click_hanlder = (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
            this.click_cell(cell);
        };
        let mouse_move_handler = (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
            if (this.dragging) {
                this.drag_cell(cell);
            }
            else {
                this.hover_cell(cell);
                this.last_hovered_cell = cell;
            }
            this.ctx.strokeRect(0, 0, this.width, this.height);
        };
        let mouse_down_handler = (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
            this.dragging_active = !cell.is_selected();
            this.dragging = true;
        };
        let mouse_up_handler = (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
            if (!this.dragging_active) {
                cell.select();
                this.fill_cell(cell, this.active_color);
            }
            else {
                cell.deselect();
                this.clear_cell(cell);
            }
            this.dragging = false;
        };
        this.canvas.onclick = click_hanlder;
        this.canvas.onmouseup = mouse_up_handler;
        this.canvas.onmousedown = mouse_down_handler;
        this.canvas.onmousemove = mouse_move_handler;
    }
    /**
     * Update the cell count of the gameboard. This will also update the
     * cell width and height. `Gameboard.draw()` should be called after this
     * method to update the canvas.
     */
    set_cell_count(cell_count) {
        this.cell_count = cell_count;
        this.cell_height = this.height / this.cell_count;
        this.cell_width = this.width / this.cell_count;
        this.last_hovered_cell = null;
    }
    /**
     * Set the color of the gameboard. This function will also redraw the gameboard.
     */
    set_color(color) {
        console.log(`Setting color to ${color}`);
        this.color = color;
        this.clear();
        this.draw();
    }
    /**
     * Set the active color of the gameboard selections. This function will also
     * redraw the gameboard.
     */
    set_active_color(color) {
        console.log(`Setting active_color to ${color}`);
        this.active_color = color;
        this.clear();
        this.draw();
    }
    /**
     * Draw the gameboard to the canvas.
     */
    draw() {
        this.ctx.strokeStyle = this.color;
        console.log(`Drawing gameboard ${this.width}x${this.height} (${this.cell_count})`);
        for (let i = 0; i < this.cell_count; i++) {
            for (let j = 0; j < this.cell_count; j++) {
                const cell = this.cell_data[i][j];
                if (cell.is_selected()) {
                    this.fill_cell(cell, this.active_color);
                }
            }
        }
        // TEMP: This is just so the gridlines are all the same size.
        this.ctx.strokeRect(0, 0, this.width, this.height);
    }
    /**
     * Clear the gameboard from the canvas.
     * This should be called before `Gameboard.draw()` to clear the canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    /**
     * Generate the cell data for the gameboard.
     * Each cell will be based on the cell width and height.
     */
    generate() {
        this.cell_data = Array.of();
        for (let i = 0; i < this.cell_count; i++) {
            for (let j = 0; j < this.cell_count; j++) {
                let a = new Coordinate(i * this.cell_width, j * this.cell_height);
                let b = new Coordinate((i + 1) * this.cell_width, (j + 1) * this.cell_height);
                if (!this.cell_data[i]) {
                    this.cell_data[i] = Array.of();
                }
                this.cell_data[i].push(new Cell(a, b));
            }
        }
    }
    /**
     * Hover event called on each cell when the user hovers over it.
     * This will highlight the cell in the color provided in the `color`
     * attribute.
     */
    hover_cell(cell) {
        if (this.last_hovered_cell) {
            this.clear_cell(this.last_hovered_cell);
            if (this.last_hovered_cell.is_selected()) {
                this.ctx.strokeStyle = this.active_color;
                this.ctx.fillRect(this.last_hovered_cell.a.x - 1, this.last_hovered_cell.a.y - 1, (this.last_hovered_cell.b.x - this.last_hovered_cell.a.x) + 2, (this.last_hovered_cell.b.y - this.last_hovered_cell.a.y) + 2);
            }
        }
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
    }
    /**
     * Drag event called on each cell when the user drags over it.
     * This functions like a painter tool, where the used can click
     * and drag to paint/erase on the canvas.
     */
    drag_cell(cell) {
        if (!cell)
            return;
        if (this.dragging_active) {
            cell.select();
            this.fill_cell(cell, this.active_color);
        }
        else {
            cell.deselect();
            this.clear_cell(cell);
        }
    }
    /**
     *
     * Click event called on each cell when the user clicks on it.
     * This will toggle the selection on the cell.
     */
    click_cell(cell) {
        for (let i = 0; i < this.ships.length; i++) {
            const ship = this.ships[i];
        }
        cell.toggle_select();
        if (cell.is_selected()) {
            this.fill_cell(cell, this.active_color);
        }
        else {
            this.clear_cell(cell);
        }
    }
    /**
    * Fill a cell with a color.
    */
    fill_cell(cell, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
    }
    /**
     * Clear the color of a cell. The border will also be removed, should it
     * somehow exist.
     */
    clear_cell(cell) {
        this.ctx.clearRect(cell.a.x - 1, cell.a.y - 1, (cell.b.x - cell.a.x) + 2, (cell.b.y - cell.a.y) + 2);
    }
    /**
     * Add a ship to the gameboard. If the ship is invalid, an error is returned.
     */
    add_ship(ship) {
        // Loop over all the ships, likely fast enough since there will only be a few ships
        for (let i = 0; i < this.ships.length; i++) {
            let s = this.ships[i];
            // If the provided ship is horizontal, loop over the x-coordinates
            if (ship.direction() === Direction.Horizontal) {
                for (let j = ship.start.x; j <= ship.end.x; j++) {
                    // Check if the new ship (at this coord) intersects witht the current ship
                    if (s.intersects(new Coordinate(j, ship.start.y))) {
                        return new Error("Ship intersects with another ship");
                    }
                }
            }
            // If the provided ship is vertical, loop overthe y-coordinates
            if (ship.direction() === Direction.Vertical) {
                for (let j = ship.start.y; j <= ship.end.y; j++) {
                    // Check if the new ship (at this coord) intersects with the current ship
                    if (s.intersects(new Coordinate(ship.start.x, j))) {
                        return new Error("Ship intersects with another ship");
                    }
                }
            }
        }
        // No return, so the ship is valid and can be added to the list
        this.ships.push(ship);
    }
}
