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
   * Color of the gameboard and grid.
   */
  color: string = "white";
  active_color: string = "red";

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

  /**
   * Last cell hovered by the user. Used to un-highlight the cell when the user 
   * moves the mouse.
   */
  private last_hovered_cell: Cell | null = null;

  dragging: boolean = false;
  dragging_active: boolean = false;

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

    let click_hanlder = (event: MouseEvent): void => {
      let x: number = event.offsetX;
      let y: number = event.offsetY;
      let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
      this.click_cell(cell);
    };

    let mouse_move_handler = (event: MouseEvent): void => {
      let x: number = event.offsetX;
      let y: number = event.offsetY;
      let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];
      if (this.dragging) {
        this.drag_cell(cell);
      } else {
        this.hover_cell(cell);
        this.last_hovered_cell = cell;
      }

      this.ctx.strokeRect(0, 0, this.width, this.height);
    };

    let mouse_down_handler = (event: MouseEvent): void => {
      let x: number = event.offsetX;
      let y: number = event.offsetY;
      let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];

      this.dragging_active = !cell.is_selected();

      this.dragging = true;
    }

    let mouse_up_handler = (event: MouseEvent): void => {
      let x: number = event.offsetX;
      let y: number = event.offsetY;
      let cell = this.cell_data[Math.floor(x / this.cell_width)][Math.floor(y / this.cell_height)];

      if (!this.dragging_active) {
        cell.select();
        this.fill_cell(cell, this.active_color);
      } else {
        cell.deselect();
        this.clear_cell(cell);
      }

      this.dragging = false;
    }


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
  set_cell_count(cell_count: number): void {
    this.cell_count = cell_count;
    this.cell_height = this.height / this.cell_count;
    this.cell_width = this.width / this.cell_count;
    this.last_hovered_cell = null;
  }

  /** 
   * Set the color of the gameboard. This function will also redraw the gameboard.
   */
  set_color(color: string): void {
    console.log(`Setting color to ${color}`);
    this.color = color;
    this.clear();
    this.draw();
  }

  /** 
   * Set the active color of the gameboard selections. This function will also 
   * redraw the gameboard.
   */
  set_active_color(color: string): void {
    console.log(`Setting active_color to ${color}`);
    this.active_color = color;
    this.clear();
    this.draw();
  }

  /**
   * Draw the gameboard to the canvas.
   */
  draw(): void {
    this.ctx.strokeStyle = this.color;
    console.log(`Drawing gameboard ${this.width}x${this.height} (${this.cell_count})`);
    for (let i = 0; i < this.cell_count; i++) {
      for (let j = 0; j < this.cell_count; j++) {
        const cell: Cell = this.cell_data[i][j];
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
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Generate the cell data for the gameboard.
   * Each cell will be based on the cell width and height.
   */
  generate(): void {
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
  hover_cell(cell: Cell): void {
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
  drag_cell(cell: Cell): void {
    if (!cell) return;

    if (this.dragging_active) {
      cell.select();
      this.fill_cell(cell, this.active_color);
    } else {
      cell.deselect();
      this.clear_cell(cell);
    }
  }

  /**
   *
   * Click event called on each cell when the user clicks on it.
   * This will toggle the selection on the cell.
   */
  click_cell(cell: Cell): void {
    cell.toggle_select();

    if (cell.is_selected()) {
      this.fill_cell(cell, this.active_color);
    } else {
      this.clear_cell(cell);
    }
  }

  /**
  * Fill a cell with a color.
  */
  fill_cell(cell: Cell, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
  }

  /**
   * Clear the color of a cell. The border will also be removed, should it 
   * somehow exist.
   */
  clear_cell(cell: Cell): void {
    this.ctx.clearRect(cell.a.x - 1, cell.a.y - 1, (cell.b.x - cell.a.x) + 2, (cell.b.y - cell.a.y) + 2);
  }
}
