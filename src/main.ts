import { Gameboard } from "./gameboard.js";
import { Ship, Ships } from "./data.js";
import { Coordinate } from "./cell.js";

declare global {
  interface Window {
    inputChange: () => void;
    changeColor: () => void;
    placeNewShip: () => void;
    changeActiveColor: () => void;
  }
}

const canvas: HTMLCanvasElement = document.getElementById("gameboard") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 800;
canvas.height = 800;

const gameboard = new Gameboard(canvas, ctx);

let val: void | Error;
val = gameboard.add_ship(new Ship(Ships.Carrier, new Coordinate(0, 0), new Coordinate(0, 4)));
if (val instanceof Error) {
  console.error(val.message);
}
val = gameboard.add_ship(new Ship(Ships.Battleship, new Coordinate(1, 2), new Coordinate(4, 2)));
if (val instanceof Error) {
  console.error(val.message);
}
val = gameboard.add_ship(new Ship(Ships.Battleship, new Coordinate(9, 8), new Coordinate(9, 9)));
if (val instanceof Error) {
  console.error(val.message);
}

gameboard.generate();

function inputChange(): void {
  const input: HTMLInputElement = document.getElementById("cell_count") as HTMLInputElement;
  const cell_count: number = parseInt(input.value);
  if (cell_count > 50) {
    alert("Cell count must be less than 50. Otherwise, the site will crash.");
    return;
  }
  gameboard.clear();
  gameboard.set_cell_count(cell_count);
  gameboard.generate();
}

function changeColor(): void {
  const input: HTMLInputElement = document.getElementById("color_picker") as HTMLInputElement;
  const color: string = input.value;
  gameboard.set_color(color);
}

function changeActiveColor(): void {
  const input: HTMLInputElement = document.getElementById("active_color_picker") as HTMLInputElement;
  const color: string = input.value;
  gameboard.set_active_color(color);
}

function placeNewShip(): void {
  const xa: number = parseInt((document.getElementById("new_ship_x_a") as HTMLInputElement).value);
  const xb: number = parseInt((document.getElementById("new_ship_x_b") as HTMLInputElement).value);
  const ya: number = parseInt((document.getElementById("new_ship_y_a") as HTMLInputElement).value);
  const yb: number = parseInt((document.getElementById("new_ship_y_b") as HTMLInputElement).value);

  if (xa < 0 || xb < 0 || ya < 0 || yb < 0) {
    alert("Coordinates must be positive.");
    return;
  }

  const cell_count: number = gameboard.get_cell_count();
  if (xa > cell_count - 1 || xb > cell_count - 1 || ya > cell_count - 1 || yb > cell_count - 1) {
    alert(`Coordinates must be less than ${cell_count - 1}.`);
    return;
  }

  if (xa == xb && ya == yb) {
    alert("Coordinates must be different.");
    return;
  }

  if (xa != xb && ya != yb) {
    alert("Coordinates must be on the same axis.");
    return;
  }

  if (xa != xb) {
    const size: number = Math.abs(xa - xb);
    if (size > 5 || size < 2) {
      alert("Ship is not valid size.");
      return;
    }

    let ship: Ship | null = null;
    switch (size) {
      case 5:
        ship = new Ship(Ships.Carrier, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 4:
        ship = new Ship(Ships.Battleship, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 3:
        ship = new Ship(Ships.Cruiser, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 2:
        ship = new Ship(Ships.Destroyer, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
    }

    // This should neber happen
    if (!ship) {
      alert("Ship is not valid size.");
      return;
    }

    console.log(ship);

    let res: void | Error = gameboard.add_ship(ship);
    if (res instanceof Error) {
      alert(res.message);
    } else {
      gameboard.generate();
      gameboard.draw();
    }
  }

  if (ya != yb) {
    const size: number = Math.abs(ya - yb);
    if (size > 5 || size < 2) {
      alert("Ship is not valid size.");
      return;
    }

    let ship: Ship | null = null;
    switch (size) {
      case 5:
        ship = new Ship(Ships.Carrier, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 4:
        ship = new Ship(Ships.Battleship, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 3:
        ship = new Ship(Ships.Cruiser, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
      case 2:
        ship = new Ship(Ships.Destroyer, new Coordinate(xa, ya), new Coordinate(xb, yb));
        break;
    }

    // This should neber happen
    if (!ship) {
      alert("Ship is not valid size.");
      return;
    }

    console.log(ship);

    let res: void | Error = gameboard.add_ship(ship);
    if (res instanceof Error) {
      alert(res.message);
    } else {
      gameboard.generate();
      gameboard.draw();
    }
  }
}

window.inputChange = inputChange;
window.changeColor = changeColor;
window.changeActiveColor = changeActiveColor;
window.placeNewShip = placeNewShip;
