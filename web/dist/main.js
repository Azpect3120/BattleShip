"use strict";
const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const size_factor = 100;
canvas.width = size_factor * 10;
canvas.height = size_factor * 10;
ctx.strokeStyle = "red";
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        ctx.strokeRect(i * size_factor, j * size_factor, size_factor, size_factor);
    }
}
