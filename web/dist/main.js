import { Gameboard } from "./gameboard.js";
const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
const gameboard = new Gameboard(canvas, ctx);
gameboard.draw();
gameboard.generateCellData();
gameboard.spawnMouseEvents();
function inputChange() {
    const input = document.getElementById("cell_count");
    const cell_count = parseInt(input.value);
    gameboard.setCellCount(cell_count);
    gameboard.clear();
    gameboard.draw();
}
window.inputChange = inputChange;
