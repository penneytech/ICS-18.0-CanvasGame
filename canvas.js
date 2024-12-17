// canvas.js
export const canvas = document.getElementById('myCanvas');
export const ctx = canvas.getContext('2d');

export function drawArena(arenaRadius) {
  // ctx.beginPath();
  // ctx.arc(canvas.width / 2, canvas.height / 2, arenaRadius, 0, Math.PI * 2);
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 3;
  // ctx.stroke();
  // ctx.closePath();
}

export function drawBeyblade(beyblade) {
  ctx.save();
  ctx.translate(beyblade.x, beyblade.y);
  ctx.rotate(beyblade.rotation);

  // If angular velocity is zero, set color to grey
  const beybladeColor = beyblade.angularVelocity === 0 ? 'grey' : beyblade.color;

  ctx.beginPath();
  ctx.arc(0, 0, beyblade.radius, 0, Math.PI * 2);
  ctx.fillStyle = beybladeColor; // Use the updated color
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, -beyblade.radius);
  ctx.lineTo(0, beyblade.radius);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}
