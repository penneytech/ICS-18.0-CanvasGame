// gameLoop.js
import { beyblades } from './globals.js';
import { drawArena, drawBeyblade } from './canvas.js';
import { updateBeyblade } from './beyblades.js';
import { handleCollisions } from './collisions.js';
import { updateStats } from './stats.js';
import { ctx, canvas } from './canvas.js'
import { arenaRadius } from './globals.js';

export function gameLoop() {
  console.log("Gameloop");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawArena(arenaRadius);
  updateStats();
  handleCollisions();

  beyblades.forEach(beyblade => {
    updateBeyblade(beyblade);
    drawBeyblade(beyblade);
  });

  window.requestAnimationFrame(gameLoop);
}

gameLoop();
