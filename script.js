/*** GLOBAL VARIABLES ***/


/*** INIT FUNCTIONS ***/

// Call the init function when the HTML window loads
window.onload = init;

function init() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');

  window.requestAnimationFrame(gameLoop);
}

/*** OBJECTS AND FUNCTIONS FOR GAME ***/


/*** GAMELOOP ***/

function gameLoop(timestamp) {
  // This causes the game to loop. 
  window.requestAnimationFrame(gameLoop);
  
  // Clear the canvas on each loop. 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Call Functions For Game 

}