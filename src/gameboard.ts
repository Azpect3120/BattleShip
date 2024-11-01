import { Cell, Coordinate } from "./cell.js";

/** Gameboard class. Stores data regarding the gameboard and provides methods to draw the gameboard to the canvas.
 */
export class Gameboard {
  /**
   * Context used to draw to the canvas.
   */
  ctx: CanvasRenderingContext2D;

  /**
   * Canvas element used to draw the gameboard.
   * This element is usually used to get data and cast events.
   */
  canvas: HTMLCanvasElement;

  /**
   * Size of the gameboard.
   * Default is 0.
   * Unit: px
   */
  width: number = 0;
  height: number = 0;


  /**
   * Number of cells in the gameboard.
   * This value defines the height and width.
   */
  private cell_count: number = 10;

  /**
   * Height of each cell in the gameboard.
   * Unit: px
   */
  private cell_height: number = this.height / this.cell_count;

  /**
   * Width of each cell in the gameboard.
   * Unit: px
   */
  private cell_width: number = this.width / this.cell_count;


  /**
   * 2D array of cells. This array stores the data of each cell in the gameboard.
   * The first index is the x-coordinate, and the second index is the y-coordinate.
   */
  cell_data: Cell[][];

  private last_hovewhite_cell: Cell | null = null;

  /**
   * Constructor for the Gameboard class.
   * @param width Width of the gameboard, in pixels.
   * @param height Height of the gameboard, in pixels.
   * @param ctx Context used to draw to the canvas.
   */
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.canvas = canvas
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
  setCellCount(cell_count: number): void {
    this.cell_count = cell_count;
    this.cell_height = this.height / this.cell_count;
    this.cell_width = this.width / this.cell_count;
  }

  /**
   * Draw the gameboard to the canvas.
   */
  draw(): void {
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
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Generate the cell data for the gameboard.
   * Each cell will be based on the cell width and height.
   */
  generateCellData(): void {
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

  cell_hover(cell: Cell): void {
    this.ctx.fillStyle = "white";
    this.last_hovewhite_cell ? this.strokeCell(this.last_hovewhite_cell, "white") : null;
    this.ctx.fillRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
  }

  strokeCell(cell: Cell, color: string): void {
    this.ctx.strokeStyle = color;
    this.ctx.clearRect(cell.a.x - 1, cell.a.y - 1, (cell.b.x - cell.a.x) + 2, (cell.b.y - cell.a.y) + 2);
    this.ctx.strokeRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
    this.ctx.strokeRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
  }

  /**
  * Create the mouse events for the gameboard.
  */
  spawnMouseEvents(): void {
    let click_handler = (event: MouseEvent): void => {
      let x: number = event.offsetX;
      let y: number = event.offsetY;
      let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
      this.cell_hover(cell);
      this.last_hovewhite_cell = cell;
    };

    this.canvas.onclick = click_handler;
    this.canvas.onmousemove = click_handler;
  }
}
