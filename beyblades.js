// beyblades.js
import { beyblades, friction, gravityTowardCenter } from './globals.js';
import { canvas } from './canvas.js';
import { arenaRadius } from './globals.js';

// Helper function for random adjustments
function getRandomAdjustment(min, max) {
  return Math.random() * (max - min) + min;
}

// beyblades.js
export function updateBeyblade(beyblade) {
  // Stop movement if angular velocity is too small (within the ±2 range)
  if (Math.abs(beyblade.angularVelocity) <= 1) {
    beyblade.velocityX = 0;
    beyblade.velocityY = 0;
    beyblade.angularVelocity = 0;
    return; // Early return, no further updates needed
  }

  beyblade.x += beyblade.velocityX;
  beyblade.y += beyblade.velocityY;

  beyblade.angularVelocity = beyblade.angularVelocity * beyblade.angularVelocityFriction;
  beyblade.rotation += beyblade.angularVelocity;

  const dx = beyblade.x - canvas.width / 2;
  const dy = beyblade.y - canvas.height / 2;
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
  
  // Apply an exponential factor to the distance from the center
  const exponentialFactor = 0.3;  // You can adjust this value to control the exponential growth
  const exponentialDistance = Math.pow(distanceFromCenter, exponentialFactor);
  
  // Calculate the pull force with the exponential distance
  const pullX = -gravityTowardCenter * dx * exponentialDistance;
  const pullY = -gravityTowardCenter * dy * exponentialDistance;
  
  // Apply the forces to the beyblade's velocity
  beyblade.velocityX += pullX;
  beyblade.velocityY += pullY;
  
  beyblade.velocityX *= friction;
  beyblade.velocityY *= friction;

  // Apply random adjustments to velocity to simulate unpredictable movements
  const velocityRandomFactor = 0.60; // Adjust how much randomness to introduce
  beyblade.velocityX += getRandomAdjustment(-velocityRandomFactor, velocityRandomFactor);
  beyblade.velocityY += getRandomAdjustment(-velocityRandomFactor, velocityRandomFactor);

  if (distanceFromCenter + beyblade.radius > arenaRadius) {
    const normalX = dx / distanceFromCenter;
    const normalY = dy / distanceFromCenter;
    const dotProduct = beyblade.velocityX * normalX + beyblade.velocityY * normalY;

    beyblade.velocityX -= 2 * dotProduct * normalX;
    beyblade.velocityY -= 2 * dotProduct * normalY;

    const overlap = distanceFromCenter + beyblade.radius - arenaRadius;
    beyblade.x -= normalX * overlap;
    beyblade.y -= normalY * overlap;
  }
}



export function handleCollisions() {
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
  
          // Set a coefficient of restitution for energy loss
          const energyLossFactor = 0.5;  // More energy loss
  
          // Swap normal components for collision with energy loss factor
          const b1NormalAfter = b2Normal * energyLossFactor;
          const b2NormalAfter = b1Normal * energyLossFactor;
  
          // Update velocities with friction and normal component swap
          b1.velocityX = b1NormalAfter * normalX + b1Tangent * tangentX;
          b1.velocityY = b1NormalAfter * normalY + b1Tangent * tangentY;
          b2.velocityX = b2NormalAfter * normalX + b2Tangent * tangentX;
          b2.velocityY = b2NormalAfter * normalY + b2Tangent * tangentY;
  
          // Apply angular velocity transfer with a small energy transfer
          const angularTransfer = 0.5 * (b1.angularVelocity - b2.angularVelocity);
          b1.angularVelocity -= angularTransfer;
          b2.angularVelocity += angularTransfer;
  
          // Apply additional friction after collision to slow down the beyblades
          const extraFrictionFactor = 0.9;  // Higher friction after collision
          b1.velocityX *= friction * extraFrictionFactor;
          b1.velocityY *= friction * extraFrictionFactor;
          b2.velocityX *= friction * extraFrictionFactor;
          b2.velocityY *= friction * extraFrictionFactor;
  
          // Ensure that beyblades don't get stuck with very low velocities
          if (Math.abs(b1.velocityX) < 0.1 && Math.abs(b1.velocityY) < 0.1) {
            b1.velocityX = Math.sign(b1.velocityX) * 0.2;
            b1.velocityY = Math.sign(b1.velocityY) * 0.2;
          }
          if (Math.abs(b2.velocityX) < 0.1 && Math.abs(b2.velocityY) < 0.1) {
            b2.velocityX = Math.sign(b2.velocityX) * 0.2;
            b2.velocityY = Math.sign(b2.velocityY) * 0.2;
          }
  
          // Separate overlapping beyblades gently to avoid sticking
          const overlap = b1.radius + b2.radius - distance;
          const separationDistance = overlap / 2;
          b1.x -= normalX * separationDistance;
          b1.y -= normalY * separationDistance;
          b2.x += normalX * separationDistance;
          b2.y += normalY * separationDistance;
        }
      }
    }
}
