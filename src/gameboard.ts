/**
 * Gameboard class. Stores data regarding the gameboard and provides methods
 * to draw the gameboard to the canvas.
 */
export class Gameboard {
  /**
   * Context used to draw to the canvas.
   */
  ctx: CanvasRenderingContext2D;

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
   * Constructor for the Gameboard class.
   * @param width Width of the gameboard, in pixels.
   * @param height Height of the gameboard, in pixels.
   * @param ctx Context used to draw to the canvas.
   */
  constructor(width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.cell_height = this.height / this.cell_count;
    this.cell_width = this.width / this.cell_count;
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
    this.ctx.strokeStyle = "red";
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
}
