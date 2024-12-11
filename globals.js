// globals.js
export const arenaRadius = 200;
export const friction = 0.998;
export const gravityTowardCenter = 0.01;

export const beyblades = [
  {
    x: 400,
    y: 250,
    radius: 20,
    velocityX: 0,
    velocityY: 20,
    rotation: 0,
    angularVelocity: 7,
    angularVelocityFriction: 0.999,
    color: 'blue'
  },
  {
    x: 450,
    y: 300,
    radius: 20,
    velocityX: -15,
    velocityY: -10,
    rotation: 0,
    angularVelocity: 6,
    angularVelocityFriction: 0.998,
    color: 'red'
  },
  {
    x: 300,
    y: 300,
    radius: 20,
    velocityX: -5,
    velocityY: 10,
    rotation: 0,
    angularVelocity: 8,
    angularVelocityFriction: 0.998,
    color: 'green'
  },
];
