import { Gameboard } from "./gameboard.js";
import { Ship, Ships } from "./data.js";
import { Coordinate } from "./cell.js";

declare global {
  interface Window {
    inputChange: () => void;
    changeColor: () => void;
    changeActiveColor: () => void;
  }
}

const canvas: HTMLCanvasElement = document.getElementById("gameboard") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 800;
canvas.height = 800;

const gameboard = new Gameboard(canvas, ctx);
gameboard.generate();
gameboard.draw();

let val: void | Error;
val = gameboard.add_ship(new Ship(Ships.Carrier, new Coordinate(0, 0), new Coordinate(0, 4)));
if (val instanceof Error) {
  console.error(val.message);
}
val = gameboard.add_ship(new Ship(Ships.Battleship, new Coordinate(1, 2), new Coordinate(4, 2)));
if (val instanceof Error) {
  console.error(val.message);
}

console.log(gameboard.ships);

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
  gameboard.draw();
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


window.inputChange = inputChange;
window.changeColor = changeColor;
window.changeActiveColor = changeActiveColor;
