import { Cell, Coordinate } from "./cell.js";
import { Direction, Ship } from "./data.js";

/** 
 * Gameboard class. Stores data regarding the gameboard and provides methods to draw the gameboard to the canvas.
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
   * Stores the ships on the gameboard. The ships are looped through to determine
   * if a ship is hit or not. They are also used to draw the ships on the board.
   */
  ships: Ship[] = [];

  /**
   * Last cell hovered by the user. Used to un-highlight the cell when the user 
   * moves the mouse.
   */
  private last_hovered_cell: Cell | null = null;

  /**
   * Whether the user is dragging. Used to determine if the user is dragging
   * the mouse to allow for selections. Might remove the 'paint' feature.
   */
  // dragging: boolean = false;

  /**
   * Whether the use is dragging to paint or to erase.
   */
  // dragging_active: boolean = false;

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
      this.hover_cell(cell);
      this.last_hovered_cell = cell;

      this.ctx.strokeRect(0, 0, this.width, this.height);
    };

    this.canvas.onclick = click_hanlder;
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
   * Get the cell count of the gameboard.
   */
  get_cell_count(): number {
    return this.cell_count;
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
        if (cell.is_selected() || cell.is_ship()) {
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
   * Uses the data stored in `ships` to fill the cells with the ships.
   * Calls `draw` after generating the data. Caller does not need to 
   * call `draw`.
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

    for (let ship of this.ships) {
      if (ship.direction() === Direction.Horizontal) {
        for (let i = ship.start.x; i <= ship.end.x; i++) {
          this.cell_data[i][ship.start.y].place_ship();
        }
      }
      if (ship.direction() === Direction.Vertical) {
        for (let i = ship.start.y; i <= ship.end.y; i++) {
          this.cell_data[ship.start.x][i].place_ship();
        }
      }
    }

    this.draw();
  }

  /**
   * Hover event called on each cell when the user hovers over it.
   * This will highlight the cell in the color provided in the `color` 
   * attribute.
   */
  hover_cell(cell: Cell): void {
    if (this.last_hovered_cell) {
      this.clear_cell(this.last_hovered_cell);

      if (this.last_hovered_cell.is_selected() || this.last_hovered_cell.is_ship()) {
        this.ctx.strokeStyle = this.active_color;
        this.ctx.fillRect(this.last_hovered_cell.a.x - 1, this.last_hovered_cell.a.y - 1, (this.last_hovered_cell.b.x - this.last_hovered_cell.a.x) + 2, (this.last_hovered_cell.b.y - this.last_hovered_cell.a.y) + 2);
      }
    }

    this.ctx.strokeStyle = this.color;
    this.ctx.strokeRect(cell.a.x, cell.a.y, (cell.b.x - cell.a.x), (cell.b.y - cell.a.y));
  }

  /**
   * Click event called on each cell when the user clicks on it.
   * This will toggle the selection on the cell.
   */
  click_cell(cell: Cell): void {
    // Create a coordinate for the cell, this is used for the
    // intersection check.
    const cell_coord: Coordinate = new Coordinate(
      Math.floor(cell.a.x / this.cell_width),
      Math.floor(cell.a.y / this.cell_height)
    );

    console.log(cell_coord);

    for (let i = 0; i < this.ships.length; i++) {
      const ship = this.ships[i];
      if (ship.direction() === Direction.Vertical) {
        for (let j = ship.start.y; j <= ship.end.y; j++) {
          if (cell_coord.y === j && (cell_coord.x === ship.start.x)) {
            // Do something
            console.log("HIT!");
            cell.select();

            if (cell.is_selected()) {
              this.fill_cell(cell, this.active_color);
            } else {
              this.clear_cell(cell);
            }
          }
        }
      }
      if (ship.direction() === Direction.Horizontal) {
        for (let j = ship.start.x; j <= ship.end.x; j++) {
          if (cell_coord.x === j && (cell_coord.y === ship.start.y)) {
            // Do something
            console.log("HIT!");
            cell.select();

            if (cell.is_selected()) {
              this.fill_cell(cell, this.active_color);
            } else {
              this.clear_cell(cell);
            }
          }
        }
      }
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

  /**
   * Add a ship to the gameboard. If the ship is invalid, an error is returned.
   * Does not call `Gameboard.generate()` or `Gameboard.draw()`. Caller must
   * call the `Gameboard.generate()` method.
   */
  add_ship(ship: Ship): void | Error {
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
