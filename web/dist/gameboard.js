import { Cell, Coordinate } from "./cell.js";
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
        this.last_hovewhite_cell = null;
        this.ctx = ctx;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cell_height = this.height / this.cell_count;
        this.cell_width = this.width / this.cell_count;
        this.cell_data = [];
    }
    /**
     * Update the cell count of the gameboard. This will also update the
     * cell width and height. `Gameboard.draw()` should be called after this
     * method to update the canvas.
     */
    setCellCount(cell_count) {
        this.cell_count = cell_count;
        this.cell_height = this.height / this.cell_count;
        this.cell_width = this.width / this.cell_count;
    }
    /**
     * Draw the gameboard to the canvas.
     */
    draw() {
        this.ctx.strokeStyle = "white";
        console.log(`Drawing gameboard ${this.width}x${this.height} (${this.cell_count})`);
        console.log(`cell_width: ${this.cell_width}, cell_height: ${this.cell_height}`);
        for (let i = 0; i < this.cell_count; i++) {
            for (let j = 0; j < this.cell_count; j++) {
                this.ctx.strokeRect(i * this.cell_width, j * this.cell_height, this.cell_width, this.cell_height);
            }
        }
        // TEMP: This is just so the gridlines are all the same size.
        this.ctx.strokeRect(1, 1, this.width, this.height);
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
    generateCellData() {
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
    cell_hover(cell) {
        this.ctx.fillStyle = "white";
        this.last_hovewhite_cell ? this.strokeCell(this.last_hovewhite_cell, "white") : null;
        this.ctx.fillRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
    }
    strokeCell(cell, color) {
        this.ctx.strokeStyle = color;
        this.ctx.clearRect(cell.a.x - 1, cell.a.y - 1, (cell.b.x - cell.a.x) + 2, (cell.b.y - cell.a.y) + 2);
        for (let i = 0; i < 10; i++) {
            this.ctx.strokeRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
        }
    }
    /**
    * Create the mouse events for the gameboard.
    */
    spawnMouseEvents() {
        let click_handler = (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
            this.cell_hover(cell);
            this.last_hovewhite_cell = cell;
        };
        this.canvas.onclick = click_handler;
        this.canvas.onmousemove = click_handler;
    }
}
