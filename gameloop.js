import { beyblades, createBeyblades } from './globals.js';
import { drawArena, drawBeyblade } from './canvas.js';
import { updateBeyblade } from './beyblades.js';
import { handleCollisions } from './collisions.js';
import { updateStats } from './stats.js';
import { ctx, canvas } from './canvas.js';
import { arenaRadius } from './globals.js';

let winnerDisplayed = false;  // Track if the winner message has been displayed
let winnerMessageTimeout;  // Store the timeout for resetting the game
let winnerMessage = '';  // Store the winner message

export function gameLoop() {
  console.log("Gameloop");

  // Always clear the canvas at the beginning of the game loop
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  // Draw the arena and update stats, beyblades, and handle collisions
  drawArena(arenaRadius);
  updateStats();
  handleCollisions();

  beyblades.forEach(beyblade => {
    updateBeyblade(beyblade);
    drawBeyblade(beyblade);
  });

  // Check if all beyblades have angular velocity within the threshold
  const activeBeyblades = beyblades.filter(beyblade => Math.abs(beyblade.angularVelocity) > 0);

  if (activeBeyblades.length === 1 && !winnerDisplayed) {
    winnerDisplayed = true;
    const winnerIndex = beyblades.indexOf(activeBeyblades[0]) + 1;  // Get the index of the winning beyblade (1-based)
    winnerMessage = `BEYBLADE ${winnerIndex} WINS`;  // Set the winner message

    console.log(winnerMessage);

    // Show the winner message on the canvas for 1 second
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(winnerMessage, canvas.width / 2 - 100, canvas.height / 2);

    // Restart the simulation after 1 second
    winnerMessageTimeout = setTimeout(() => {
      beyblades.length = 0; // Clear existing beyblades
      beyblades.push(...createBeyblades()); // Add new beyblades
      winnerDisplayed = false;  // Reset the flag
    }, 1000);
  } else if (activeBeyblades.length > 1) {
    // Reset winnerDisplayed if there are still multiple beyblades moving
    winnerDisplayed = false;
    winnerMessage = '';  // Clear the winner message
    clearTimeout(winnerMessageTimeout);  // Clear the timeout if the game continues
  }

  // Display the winner message once it's set
  if (winnerDisplayed) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(winnerMessage, canvas.width / 2 - 100, canvas.height / 2);
  }

  window.requestAnimationFrame(gameLoop);
}

gameLoop();
