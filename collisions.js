// collisions.js
import { beyblades, friction } from './globals.js';

export function handleCollisions() {
  for (let i = 0; i < beyblades.length; i++) {
    for (let j = i + 1; j < beyblades.length; j++) {
      const b1 = beyblades[i];
      const b2 = beyblades[j];

      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < b1.radius + b2.radius) {
        const normalX = dx / distance;
        const normalY = dy / distance;
        const tangentX = -normalY;
        const tangentY = normalX;

        const b1Normal = b1.velocityX * normalX + b1.velocityY * normalY;
        const b2Normal = b2.velocityX * normalX + b2.velocityY * normalY;
        const b1Tangent = b1.velocityX * tangentX + b1.velocityY * tangentY;
        const b2Tangent = b2.velocityX * tangentX + b2.velocityY * tangentY;

        const b1NormalAfter = b2Normal * 0.8;
        const b2NormalAfter = b1Normal * 0.8;

        b1.velocityX = b1NormalAfter * normalX + b1Tangent * tangentX;
        b1.velocityY = b1NormalAfter * normalY + b1Tangent * tangentY;
        b2.velocityX = b2NormalAfter * normalX + b2Tangent * tangentX;
        b2.velocityY = b2NormalAfter * normalY + b2Tangent * tangentY;

        const angularTransfer = 0.05 * (b1.angularVelocity - b2.angularVelocity);
        b1.angularVelocity -= angularTransfer;
        b2.angularVelocity += angularTransfer;

        b1.velocityX *= friction;
        b1.velocityY *= friction;
        b2.velocityX *= friction;
        b2.velocityY *= friction;

        if (Math.abs(b1.velocityX) < 0.1 && Math.abs(b1.velocityY) < 0.1) {
          b1.velocityX = Math.sign(b1.velocityX) * 0.2;
          b1.velocityY = Math.sign(b1.velocityY) * 0.2;
        }
        if (Math.abs(b2.velocityX) < 0.1 && Math.abs(b2.velocityY) < 0.1) {
          b2.velocityX = Math.sign(b2.velocityX) * 0.2;
          b2.velocityY = Math.sign(b2.velocityY) * 0.2;
        }

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
