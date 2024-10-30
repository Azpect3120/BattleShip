const canvas: HTMLCanvasElement = document.getElementById("gameboard") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;


const size_factor: number = 100;

canvas.width = size_factor * 10;
canvas.height = size_factor * 10;


ctx.strokeStyle = "red";

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    ctx.strokeRect(i * size_factor, j * size_factor, size_factor, size_factor);
  }
}
