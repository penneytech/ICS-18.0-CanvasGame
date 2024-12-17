export const arenaRadius = 240;
export const friction = 0.995;
export const gravityTowardCenter = 0.0002;

import { canvas } from "./canvas.js";

// Function to generate a random number between min and max
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate a random angle (in radians)
function getRandomAngle() {
  return Math.random() * 2 * Math.PI; // Random angle in radians (0 to 2π)
}

// Function to generate a random distance from the center of the arena
function getRandomDistance() {
  return Math.random() * (arenaRadius - 20 - 30) + 30; // Ensure beyblades spawn at least 30px away from the center
}

// Function to generate a random velocity for both X and Y
function getRandomVelocity(min, max) {
  return {
    velocityX: getRandom(min, max), // Random horizontal velocity
    velocityY: getRandom(min, max), // Random vertical velocity
  };
}

// Function to generate a random angular velocity with a minimum absolute value of 5
function getRandomAngularVelocity(min, max) {
  let velocity = getRandom(min, max); // Get the random angular velocity

  // Ensure the value is at least 5 or -5
  if (Math.abs(velocity) < 5) {
    velocity = velocity < 0 ? -5 : 5; // If less than 5 or greater than -5, set it to +5 or -5 accordingly
  }

  return velocity;
}

// Function to generate a random RGB color
function getRandomColor() {
  const r = Math.floor(getRandom(0, 256)); // Random red value (0-255)
  const g = Math.floor(getRandom(0, 256)); // Random green value (0-255)
  const b = Math.floor(getRandom(0, 256)); // Random blue value (0-255)
  return `rgb(${r}, ${g}, ${b})`; // Return color in RGB format
}

// Lists of prefixes, middle parts, and suffixes for generating names
const prefixes = [
  "Blaze", "Storm", "Thunder", "Cyclone", "Inferno", "Aqua", "Vortex", "Shadow",
  "Titan", "Meteor", "Spark", "Venom", "Razor", "Blizzard", "Crimson", "Phantom", "Galaxy"
];

const middleParts = [
  "Fury", "Strike", "Dash", "Surge", "Burst", "Force", "Spin", "Edge", "Power", "Clash",
  "Blast", "Rage", "Glide", "Shadow", "Wave", "Vibe", "Tornado", "Whirlwind"
];

const suffixes = [
  "Nova", "X", "Prime", "Z", "Max", "Force", "Legend", "King", "Beast", "Dragon", "Knight"
];

// Function to generate a random name by combining parts from each list
function getRandomName() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = middleParts[Math.floor(Math.random() * middleParts.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Combining the random parts to form a full name
  return `${prefix} ${middle} ${suffix}`;
}

// Function to create a random beyblade
export function createRandomBeyblade() {
  const angle = getRandomAngle(); // Random angle for position
  const distanceFromCenter = getRandomDistance(); // Random distance from the center

  const x = canvas.width / 2 + Math.cos(angle) * distanceFromCenter;
  const y = canvas.height / 2 + Math.sin(angle) * distanceFromCenter;

  const { velocityX, velocityY } = getRandomVelocity(-10, 10); // Random velocity
  const angularVelocity = getRandomAngularVelocity(-15, 15); // Random angular velocity

  return {
    name: getRandomName(), // Assign a random name
    x,
    y,
    radius: 10,
    velocityX,
    velocityY,
    rotation: 0,
    angularVelocity,
    angularVelocityFriction: 0.999, // Default angular velocity friction
    color: getRandomColor(), // Assign a random color
  };
}

// Function to create new beyblades
export function createBeyblades() {
  return [
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
    createRandomBeyblade(),
  ];
}

// Use let to allow reassignment of beyblades
export let beyblades = createBeyblades();
