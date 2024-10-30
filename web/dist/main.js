"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameboard_js_1 = require("./gameboard.js");
// declare global {
//   interface Window {
//     inputChange: () => void;
//   }
// }
const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
const gameboard = new gameboard_js_1.Gameboard(canvas.width, canvas.height, ctx);
gameboard.draw();
// function inputChange(): void {
//   const input: HTMLInputElement = document.getElementById("cell_count") as HTMLInputElement;
//   const cell_count: number = parseInt(input.value);
//   gameboard.setCellCount(cell_count);
//   gameboard.clear();
//   gameboard.draw();
// }
//
// window.inputChange = inputChange;
