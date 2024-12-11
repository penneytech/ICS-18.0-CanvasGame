// beyblades.js
import { beyblades, friction, gravityTowardCenter } from './globals.js';
import { canvas } from './canvas.js';
import { arenaRadius } from './globals.js';

export function updateBeyblade(beyblade) {
  beyblade.x += beyblade.velocityX;
  beyblade.y += beyblade.velocityY;

  beyblade.angularVelocity = beyblade.angularVelocity * beyblade.angularVelocityFriction;
  beyblade.rotation += beyblade.angularVelocity;

  const dx = beyblade.x - canvas.width / 2;
  const dy = beyblade.y - canvas.height / 2;
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

  const pullX = -gravityTowardCenter * dx;
  const pullY = -gravityTowardCenter * dy;
  beyblade.velocityX += pullX;
  beyblade.velocityY += pullY;

  beyblade.velocityX *= friction;
  beyblade.velocityY *= friction;

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
  
          // Swap normal components for elastic collision
          const b1NormalAfter = b2Normal * 0.8;  // Apply energy loss factor (coefficient of restitution)
          const b2NormalAfter = b1Normal * 0.8;  // Apply energy loss factor
  
          // Update velocities with friction and normal component swap
          b1.velocityX = b1NormalAfter * normalX + b1Tangent * tangentX;
          b1.velocityY = b1NormalAfter * normalY + b1Tangent * tangentY;
          b2.velocityX = b2NormalAfter * normalX + b2Tangent * tangentX;
          b2.velocityY = b2NormalAfter * normalY + b2Tangent * tangentY;
  
          // Apply angular velocity transfer with a small energy transfer
          const angularTransfer = 0.05 * (b1.angularVelocity - b2.angularVelocity);
          b1.angularVelocity -= angularTransfer;
          b2.angularVelocity += angularTransfer;
  
          // Apply friction after collision to slow down the beyblades
          b1.velocityX *= friction;
          b1.velocityY *= friction;
          b2.velocityX *= friction;
          b2.velocityY *= friction;
  
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
