/*** GLOBAL VARIABLES ***/
let canvas, ctx;
const arenaRadius = 200; // Radius of the arena
const friction = 0.998; // Friction coefficient to simulate velocity loss
const gravityTowardCenter = 0.01; // Force pulling the beyblades toward the center

const beyblades = [
  {
    x: 400, // Initial position of the first beyblade
    y: 250,
    radius: 20, // Radius of the beyblade
    velocityX: 0, // Initial velocity in the X direction
    velocityY: 20, // Initial velocity in the Y direction
    rotation: 0, // Initial rotation angle in radians
    angularVelocity: 7, // Rotation speed
    angularVelocityFriction: 0.999,
    color: 'blue'
  },
  {
    x: 450, // Initial position of the second beyblade
    y: 300,
    radius: 20,
    velocityX: -15, // Different velocity for the second beyblade
    velocityY: -10,
    rotation: 0,
    angularVelocity: 6,
    angularVelocityFriction: 0.998,
    color: 'red'
  },
  {
    x: 300, // Initial position of the second beyblade
    y: 300,
    radius: 20,
    velocityX: -5, // Different velocity for the second beyblade
    velocityY: 10,
    rotation: 0,
    angularVelocity: 8,
    angularVelocityFriction: 0.998,
    color: 'green'
  },
];

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

function drawBeyblade(beyblade) {
  ctx.save();
  ctx.translate(beyblade.x, beyblade.y);
  ctx.rotate(beyblade.rotation);
  
  // Draw the beyblade body
  ctx.beginPath();
  ctx.arc(0, 0, beyblade.radius, 0, Math.PI * 2);
  ctx.fillStyle = beyblade.color;
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

function updateBeyblade(beyblade) {
  // Update position based on velocity
  beyblade.x += beyblade.velocityX;
  beyblade.y += beyblade.velocityY;

  // Simulate rotation
  beyblade.angularVelocity = beyblade.angularVelocity * beyblade.angularVelocityFriction;
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
}

function handleCollisions() {
  for (let i = 0; i < beyblades.length; i++) {
    for (let j = i + 1; j < beyblades.length; j++) {
      const b1 = beyblades[i];
      const b2 = beyblades[j];

      // Calculate the distance between the two beyblades
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if collision occurs
      if (distance < b1.radius + b2.radius) {
        // Calculate normal and tangent unit vectors
        const normalX = dx / distance;
        const normalY = dy / distance;
        const tangentX = -normalY;
        const tangentY = normalX;

        // Decompose velocities into normal and tangential components
        const b1Normal = b1.velocityX * normalX + b1.velocityY * normalY;
        const b2Normal = b2.velocityX * normalX + b2.velocityY * normalY;
        const b1Tangent = b1.velocityX * tangentX + b1.velocityY * tangentY;
        const b2Tangent = b2.velocityX * tangentX + b2.velocityY * tangentY;

        // Swap normal components for elastic collision
        const b1NormalAfter = b2Normal;
        const b2NormalAfter = b1Normal;

        // Update velocities
        b1.velocityX = b1NormalAfter * normalX + b1Tangent * tangentX;
        b1.velocityY = b1NormalAfter * normalY + b1Tangent * tangentY;
        b2.velocityX = b2NormalAfter * normalX + b2Tangent * tangentX;
        b2.velocityY = b2NormalAfter * normalY + b2Tangent * tangentY;

        // Adjust angular velocities with a small energy transfer
        const angularTransfer = 0.05 * (b1.angularVelocity - b2.angularVelocity);
        b1.angularVelocity -= angularTransfer;
        b2.angularVelocity += angularTransfer;

        // // Separate overlapping beyblades gently to avoid sticking
        const overlap = b1.radius + b2.radius - distance;
        const separationDistance = overlap / 2;

        // // Move beyblades apart along the normal direction
        // b1.x -= normalX * separationDistance;
        // b1.y -= normalY * separationDistance;
        // b2.x += normalX * separationDistance;
        // b2.y += normalY * separationDistance;
      }
    }
  }
}



function updateStats() {
  const statsTable = document.getElementById('statsTable');

  // Clear the table except for the header row
  statsTable.innerHTML = `
    <tr>
      <th>Beyblade</th>
      <th>Position (x, y)</th>
      <th>Velocity (vx, vy)</th>
      <th>Rotation</th>
      <th>Angular Velocity</th>
    </tr>
  `;

  // Add a row for each beyblade
  beyblades.forEach((beyblade, index) => {
    const row = document.createElement('tr');

    // Add Beyblade index
    const nameCell = document.createElement('td');
    nameCell.textContent = `Beyblade ${index + 1}`;
    row.appendChild(nameCell);

    // Add Position
    const positionCell = document.createElement('td');
    positionCell.textContent = `(${beyblade.x.toFixed(2)}, ${beyblade.y.toFixed(2)})`;
    row.appendChild(positionCell);

    // Add Velocity
    const velocityCell = document.createElement('td');
    velocityCell.textContent = `(${beyblade.velocityX.toFixed(2)}, ${beyblade.velocityY.toFixed(2)})`;
    row.appendChild(velocityCell);

    // Add Rotation
    const rotationCell = document.createElement('td');
    rotationCell.textContent = beyblade.rotation.toFixed(2);
    row.appendChild(rotationCell);

    // Add Angular Velocity
    const angularVelocityCell = document.createElement('td');
    angularVelocityCell.textContent = beyblade.angularVelocity.toFixed(2);
    row.appendChild(angularVelocityCell);

    statsTable.appendChild(row);
  });
}


/*** GAMELOOP ***/

function gameLoop() {
  // This causes the game to loop. 
  window.requestAnimationFrame(gameLoop);
  
  // Clear the canvas on each loop. 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Call Functions For Game 
  drawArena();
  updateStats();
 handleCollisions();

  beyblades.forEach(beyblade => {
    updateBeyblade(beyblade);
    drawBeyblade(beyblade);
  });
}
