import { beyblades, createBeyblades } from './globals.js';
import { drawArena, drawBeyblade } from './canvas.js';
import { updateBeyblade } from './beyblades.js';
import { handleCollisions } from './collisions.js';
import { updateStats } from './stats.js';
import { ctx, canvas } from './canvas.js';
import { arenaRadius } from './globals.js';

let winnerDisplayed = false; // Track if the winner message has been displayed
let winnerMessageTimeout; // Store the timeout for resetting the game
let winnerMessage = ''; // Store the winner message
const dots = []; // Array to hold power-up dots
const dotRadius = 5; // Radius of the dots

// Function to add a single dot
function addDot() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radiusLimit = arenaRadius - dotRadius; // Ensure dots stay within the circle
  
  let x, y;
  let validPosition = false;

  while (!validPosition) {
    // Generate a random angle and distance within the circle
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * radiusLimit; // Random distance within the circle

    x = centerX + distance * Math.cos(angle);
    y = centerY + distance * Math.sin(angle);

    // Ensure the new dot does not overlap with any Beyblade
    validPosition = beyblades.every(beyblade => {
      const distX = beyblade.x - x;
      const distY = beyblade.y - y;
      const distanceToBeyblade = Math.sqrt(distX ** 2 + distY ** 2);
      return distanceToBeyblade >= beyblade.radius + dotRadius;
    });
  }

  // Add the new dot to the array
  dots.push({ x, y, radius: dotRadius });
}


// Function to draw dots
function drawDots() {
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow'; // Dots are yellow
    ctx.fill();
    ctx.closePath();
  });
}

// Function to detect collision between a Beyblade and a dot
function checkDotCollisions() {
  beyblades.forEach(beyblade => {
    dots.forEach((dot, index) => {
      const distX = beyblade.x - dot.x;
      const distY = beyblade.y - dot.y;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);

      if (distance < beyblade.radius + dot.radius) {
        // Collision detected
        if (beyblade.angularVelocity > 0) {
          beyblade.angularVelocity += 5; // Increase angular velocity positively
        } else {
          beyblade.angularVelocity -= 5; // Decrease angular velocity negatively
        }
        dots.splice(index, 1); // Remove the dot
      }
    });
  });
}


export function gameLoop() {
  console.log("Gameloop");

  // Always clear the canvas at the beginning of the game loop
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the arena and update stats, beyblades, and handle collisions
  drawArena(arenaRadius);
  updateStats();
  handleCollisions();

  // Draw dots and check for collisions
  drawDots();
  checkDotCollisions();

  beyblades.forEach(beyblade => {
    updateBeyblade(beyblade);
    drawBeyblade(beyblade);
  });

  // Check if all beyblades have angular velocity within the threshold
  const activeBeyblades = beyblades.filter(beyblade => Math.abs(beyblade.angularVelocity) > 0);

  if (activeBeyblades.length === 1 && !winnerDisplayed) {
    // One winner
    winnerDisplayed = true;
    const winnerBeyblade = activeBeyblades[0]; // Get the winning beyblade
    winnerMessage = `${winnerBeyblade.name} WINS`; // Set the winner message to the Beyblade's name

    console.log(winnerMessage);

    // Show the winner message on the canvas for 1 second
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(winnerMessage, canvas.width / 2 - 100, canvas.height / 2);

    // Restart the simulation after 1 second
    winnerMessageTimeout = setTimeout(() => {
      beyblades.length = 0; // Clear existing beyblades
      beyblades.push(...createBeyblades()); // Add new beyblades
      dots.length = 0; // Clear all dots
      winnerDisplayed = false; // Reset the flag
    }, 1000);
  } else if (activeBeyblades.length === 0 && !winnerDisplayed) {
    // Tie case where no Beyblade is active
    winnerDisplayed = true;
    winnerMessage = `IT'S A TIE!`; // Set tie message

    console.log(winnerMessage);

    // Show the tie message on the canvas for 1 second
    ctx.font = "30px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(winnerMessage, canvas.width / 2 - 100, canvas.height / 2);

    // Restart the simulation after 1 second
    winnerMessageTimeout = setTimeout(() => {
      beyblades.length = 0; // Clear existing beyblades
      beyblades.push(...createBeyblades()); // Add new beyblades
      dots.length = 0; // Clear all dots
      winnerDisplayed = false; // Reset the flag
    }, 1000);
  } else if (activeBeyblades.length > 1) {
    // Reset winnerDisplayed if there are still multiple beyblades moving
    winnerDisplayed = false;
    winnerMessage = ''; // Clear the winner message
    clearTimeout(winnerMessageTimeout); // Clear the timeout if the game continues
  }

  // Display the winner or tie message once it's set
  if (winnerDisplayed) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(winnerMessage, canvas.width / 2 - 100, canvas.height / 2);
  }

  window.requestAnimationFrame(gameLoop);
}

// Start the game and schedule dot addition every 5 seconds
gameLoop();
setInterval(addDot, 5000); // Add one dot every 5 seconds
