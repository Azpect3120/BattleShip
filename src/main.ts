import { Gameboard } from "./gameboard.js";

declare global {
  interface Window {
    inputChange: () => void;
  }
}

const canvas: HTMLCanvasElement = document.getElementById("gameboard") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 800;
canvas.height = 800;

const gameboard = new Gameboard(canvas, ctx);
gameboard.draw();
gameboard.generateCellData();
gameboard.spawnMouseEvents();

function inputChange(): void {
  const input: HTMLInputElement = document.getElementById("cell_count") as HTMLInputElement;
  const cell_count: number = parseInt(input.value);
  gameboard.setCellCount(cell_count);
  gameboard.clear();
  gameboard.draw();
}

window.inputChange = inputChange;
