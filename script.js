/*** GLOBAL VARIABLES ***/
let canvas, ctx;
const arenaRadius = 200; // Radius of the arena
const friction = 0.995; // Friction coefficient to simulate velocity loss
const gravityTowardCenter = 0.01; // Force pulling the beyblade toward the center
const beyblade = {
  x: 400, // Initial position of the beyblade (centered in the canvas for this example)
  y: 250,
  radius: 10, // Radius of the beyblade
  velocityX: 0, // Initial velocity in the X direction
  velocityY: 20, // Initial velocity in the Y direction
  rotation: 0, // Initial rotation angle in radians
  angularVelocity: 2, // Rotation speed
  angularVelocityFriction: 0.999
};

/*** INIT FUNCTIONS ***/

// Call the init function when the HTML window loads
window.onload = init;

function init() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  window.requestAnimationFrame(gameLoop);
}

/*** OBJECTS AND FUNCTIONS FOR GAME ***/

function drawArena() {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, arenaRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function drawBeyblade() {
  ctx.save();
  ctx.translate(beyblade.x, beyblade.y);
  ctx.rotate(beyblade.rotation);
  
  // Draw the beyblade body
  ctx.beginPath();
  ctx.arc(0, 0, beyblade.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();

  // Draw a line through the beyblade to indicate rotation
  ctx.beginPath();
  ctx.moveTo(0, -beyblade.radius);
  ctx.lineTo(0, beyblade.radius);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}

function updateBeyblade() {
  // Update position based on velocity
  beyblade.x += beyblade.velocityX;
  beyblade.y += beyblade.velocityY;

  // Simulate rotation
  beyblade.angularVelocity = beyblade.angularVelocity * beyblade.angularVelocityFriction
  beyblade.rotation += beyblade.angularVelocity;

  // Calculate distance from center
  const dx = beyblade.x - canvas.width / 2;
  const dy = beyblade.y - canvas.height / 2;
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

  // Apply gravitational pull toward the center
  const pullX = -gravityTowardCenter * dx;
  const pullY = -gravityTowardCenter * dy;
  beyblade.velocityX += pullX;
  beyblade.velocityY += pullY;

  // Apply friction to simulate energy loss
  beyblade.velocityX *= friction;
  beyblade.velocityY *= friction;

  // Check for collision with the arena boundary
  if (distanceFromCenter + beyblade.radius > arenaRadius) {
    // Reflect the beyblade back into the arena
    const normalX = dx / distanceFromCenter;
    const normalY = dy / distanceFromCenter;
    const dotProduct = beyblade.velocityX * normalX + beyblade.velocityY * normalY;

    beyblade.velocityX -= 2 * dotProduct * normalX;
    beyblade.velocityY -= 2 * dotProduct * normalY;

    // Move the beyblade slightly inside the boundary to prevent sticking
    const overlap = distanceFromCenter + beyblade.radius - arenaRadius;
    beyblade.x -= normalX * overlap;
    beyblade.y -= normalY * overlap;
  }

  // Update the stats display
  updateStats();
}

function updateStats() {
  const statsTable = document.getElementById('statsTable');
  statsTable.innerHTML = `
    <tr><th>Property</th><th>Value</th></tr>
    <tr><td>X Position</td><td>${beyblade.x.toFixed(2)}</td></tr>
    <tr><td>Y Position</td><td>${beyblade.y.toFixed(2)}</td></tr>
    <tr><td>Velocity X</td><td>${beyblade.velocityX.toFixed(2)}</td></tr>
    <tr><td>Velocity Y</td><td>${beyblade.velocityY.toFixed(2)}</td></tr>
    <tr><td>Rotation</td><td>${beyblade.rotation.toFixed(2)}</td></tr>
    <tr><td>Angular Velocity</td><td>${beyblade.angularVelocity.toFixed(2)}</td></tr>
  `;
}

/*** GAMELOOP ***/

function gameLoop(timestamp) {
  // This causes the game to loop. 
  window.requestAnimationFrame(gameLoop);
  
  // Clear the canvas on each loop. 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Call Functions For Game 
  drawArena();
  updateBeyblade();
  drawBeyblade();
}
