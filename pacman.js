// Board Setup
let board, context;
const TILE_SIZE = 32, ROW_COUNT = 21, COLUMN_COUNT = 19, BOARD_WIDTH = COLUMN_COUNT * TILE_SIZE, BOARD_HEIGHT = ROW_COUNT * TILE_SIZE;

// Game Asset Images
let wallImage, pacmanUpImage, pacmanDownImage, pacmanLeftImage, pacmanRightImage, blueGhostImage, orangeGhostImage, pinkGhostImage, redGhostImage;

// Flag to toggle the drawing of marks
let drawMarksFlag = false;

// Default frame rate
let selectedFps = 10; // This can be changed by the user through a selector
let frameDisplay; // Paragraph for displaying FPS


let updateTimeoutId = null;
let boardOffsetY = 0;


//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
  "XXXXXXXXXXXXXXXXXXX",
  "X        X        X",
  "X XX XXX X XXX XX X",
  "X                 X",
  "X XX X XXXXX X XX X",
  "X    X       X    X",
  "XXXX XXXX XXXX XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXrXX X XXXX",
  "O       bpo       O",
  "XXXX X XXXXX X XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXXXX X XXXX",
  "X        X        X",
  "X XX XXX X XXX XX X",
  "X  X     P     X  X",
  "XX X X XXXXX X X XX",
  "X    X   X   X    X",
  "X XXXXXX X XXXXXX X",
  "X                 X",
  "XXXXXXXXXXXXXXXXXXX"
];

const tileMap2 = [
  "XXXXXXXXXXXXXXXXXXX",
  "X        X        X",
  "X XX XXX X XXX XX X",
  "X                 X",
  "X XX X XXXXX X XX X",
  "X    X       X    X",
  "XXXX XXXX XXXX XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXrXX X XXXX",
  "O       bpo       O",
  "XXXX X XXXXX X XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXXXX X XXXX",
  "X      X  XX      X",
  "XXXXX  X    XXXXXXX",
  "X   X   P   X     X",
  "XXXXXXXXXXXXXXXXXXX",
  "X    X   X   X    X",
  "X XXXXXX X XXXXXX X",
  "X                 X",
  "XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

// Define a list of directions for the ghosts to move
const ghostDirections = ['U', 'D', 'L', 'R']; // up, down, left, right
const verticalDirections = ['U', 'D'];
let score = 0; // Initialize score
let lives = 3; // Initialize lives
let gameOver = false; // Flag to check if the game is over

// Displays the board when the page is loaded
window.onload = function () {
  board = document.getElementById('board');

  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;

  context = board.getContext("2d"); // used for drawing on the board

  loadImages();
  drawBoard(tileMap);


  for (let ghost of ghosts.values()) {
    // Randomly assign a direction to each ghost
    const randomDirection = ghostDirections[Math.floor(Math.random() * 4)]; // 0-3
    ghost.updateDirection(randomDirection);
  }

  update();

  setTimeout(() => { checkImageDrawStatus() }, 200); // Give time for images to be drawn


  // Print the size of all sets for debugging
  ensureCorrectAmounts();

  drawSwitch(); // Draw the switch for toggling features
  drawSelector(); // Draw the selector for options

  // Add key event listener
  document.addEventListener("keyup", movePacman);


  //drawPositionSliders(); // Draw sliders for score position
}




function drawPositionSliders() {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "220px";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  container.style.padding = "12px";
  container.style.borderRadius = "6px";
  container.style.zIndex = "10";

  const labelSelector = document.createElement("select");
  labelSelector.style.marginBottom = "10px";
  labelSelector.style.padding = "6px";
  labelSelector.style.fontSize = "14px";
  labelSelector.style.borderRadius = "4px";

  // Create options from existing labels
  const labelOptions = ["Score", "Lives", "Game Over", "FPS"];
  labelOptions.forEach(text => {
    const option = document.createElement("option");
    option.value = text;
    option.textContent = text;
    labelSelector.appendChild(option);
  });

  const labelX = document.createElement("label");
  labelX.textContent = `${labelSelector.value} X:`; // initial value
  labelX.style.color = "#00ffcc";

  // Update label when user selects a new option
  labelSelector.addEventListener("change", () => {
    labelX.textContent = `${labelSelector.value} X:`;
  });

  const valueMap = {
    "Score": {
      get: () => score,
      set: val => score = val,
      max: 999
    },
    "Lives": {
      get: () => lives,
      set: val => lives = val,
      max: 99
    },
    "Game Over": {
      get: () => score, // fallback, or use a flag toggle if needed
      set: val => score = val,
      max: 999
    },
    "FPS": {
      get: () => selectedFps,
      set: val => selectedFps = val,
      max: 120
    }
  };


  function createStepper(getLabel, getter, setter, maxValue) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";

    const label = document.createElement("label");
    label.style.color = "#00ffcc";
    label.textContent = getter();

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = getter();
    valueDisplay.style.color = "white";
    valueDisplay.style.minWidth = "40px";
    valueDisplay.style.textAlign = "center";
    valueDisplay.style.fontFamily = "Arial, sans-serif";

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    minusBtn.style.width = "30px";
    minusBtn.style.height = "30px";
    minusBtn.style.fontSize = "18px";
    minusBtn.style.backgroundColor = "#444";
    minusBtn.style.color = "white";
    minusBtn.style.border = "none";
    minusBtn.style.borderRadius = "4px";
    minusBtn.style.cursor = "pointer";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.style.width = "30px";
    plusBtn.style.height = "30px";
    plusBtn.style.fontSize = "18px";
    plusBtn.style.backgroundColor = "#444";
    plusBtn.style.color = "white";
    plusBtn.style.border = "none";
    plusBtn.style.borderRadius = "4px";
    plusBtn.style.cursor = "pointer";

    minusBtn.addEventListener("click", () => {
      const current = getter();
      if (current > 0) {
        setter(current - 1);
        valueDisplay.textContent = getter();
      }
    });

    plusBtn.addEventListener("click", () => {
      const current = getter();
      if (current < maxValue) {
        setter(current + 1);
        valueDisplay.textContent = getter();
      }
    });

    container.appendChild(labelSelector);
    wrapper.appendChild(labelX);
    wrapper.appendChild(minusBtn);
    wrapper.appendChild(valueDisplay);
    wrapper.appendChild(plusBtn);
    container.appendChild(wrapper);

    // Live update the label
    setInterval(() => {
      valueDisplay.textContent = getter();
    }, 250);
  }

  // Add steppers for scoreX and scoreY
  createStepper(
    () => `${labelSelector.value} X:`,
    () => valueMap[labelSelector.value].get(),
    val => valueMap[labelSelector.value].set(val),
    BOARD_HEIGHT
  );
  createStepper("Score Y:", () => livesY, val => livesY = val, BOARD_HEIGHT);

  // Display panel for current position + dimensions
  const infoDisplay = document.createElement("div");
  infoDisplay.classList.add("score-info");
  infoDisplay.style.color = "#fff";
  infoDisplay.style.fontFamily = "Arial, sans-serif";
  infoDisplay.style.fontSize = "14px";
  infoDisplay.style.marginTop = "10px";
  infoDisplay.style.backgroundColor = "rgba(0,0,0,0.5)";
  infoDisplay.style.padding = "6px 10px";
  infoDisplay.style.borderRadius = "4px";


  container.appendChild(labelX);
  container.appendChild(infoDisplay);

  document.body.appendChild(container);
}


// Check if the number of walls, foods, and ghosts matches the expected amounts
function ensureCorrectAmounts() {
  const wallsAmount = 196, foodsAmount = 184, ghostsAmount = 4;

  if (walls.size !== wallsAmount) {
    console.error("Incorrect number of walls. Expected " + wallsAmount + ", found " + walls.size);
  }
  if (foods.size !== foodsAmount) {
    console.error("Incorrect number of foods. Expected " + foodsAmount + ", found " + foods.size);
  }
  if (ghosts.size !== ghostsAmount) {
    console.error("Incorrect number of ghosts. Expected " + ghostsAmount + ", found " + ghosts.size);
  }

  // Ensure that the correct number of walls, foods, and ghosts are present
  console.log(`Walls: ${walls.size}, Foods: ${foods.size}, Ghosts: ${ghosts.size}`);
}

function checkImageDrawStatus() {
  const imageStatus = [
    { name: "Wall", image: wallImage },
    { name: "Pacman Up", image: pacmanUpImage },
    { name: "Pacman Down", image: pacmanDownImage },
    { name: "Pacman Left", image: pacmanLeftImage },
    { name: "Pacman Right", image: pacmanRightImage },
    { name: "Blue Ghost", image: blueGhostImage },
    { name: "Orange Ghost", image: orangeGhostImage },
    { name: "Pink Ghost", image: pinkGhostImage },
    { name: "Red Ghost", image: redGhostImage }
  ];

  imageStatus.forEach(({ name, image }) => {
    if (!image.complete || image.naturalWidth === 0) {
      console.error(`❌ ${name} image failed to load or draw.`);
    } else {
      console.log(`✅ ${name} image loaded and drawable.`);
    }
  });
}

// Function to load the images
function loadImages() {

  wallImage = new Image();
  wallImage.src = "./images/wall.png";

  // Load food image
  // const foodImage = new Image();
  // foodImage.src = "./images/bullet-1.png";

  // Load ghost images
  blueGhostImage = new Image();
  blueGhostImage.src = "./images/blueGhost.png";
  orangeGhostImage = new Image();
  orangeGhostImage.src = "./images/orangeGhost.png"
  pinkGhostImage = new Image()
  pinkGhostImage.src = "./images/pinkGhost.png";
  redGhostImage = new Image()
  redGhostImage.src = "./images/redGhost.png";

  // Load pacman images
  pacmanUpImage = new Image();
  pacmanUpImage.src = "./images/pacmanUp.png";
  pacmanDownImage = new Image();
  pacmanDownImage.src = "./images/pacmanDown.png";
  pacmanLeftImage = new Image();
  pacmanLeftImage.src = "./images/pacmanLeft.png";
  pacmanRightImage = new Image();
  pacmanRightImage.src = "./images/pacmanRight.png";
}

function drawBoard(tileMap) {
  // Clear the board
  walls.clear();
  foods.clear();
  ghosts.clear();

  for (let r = 0; r < ROW_COUNT; r++) {
    for (let c = 0; c < COLUMN_COUNT; c++) {
      const row = tileMap[r];
      const tileMapChar = row[c];


      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tileMapChar === 'X') {
        const wallBlock = new Block(wallImage, x, y, TILE_SIZE, TILE_SIZE);
        walls.add(wallBlock);
      }
      else if (tileMapChar === 'b') { // Blue Ghost
        const ghost = new Block(blueGhostImage, x, y, TILE_SIZE, TILE_SIZE);
        ghosts.add(ghost);
      }
      else if (tileMapChar === 'o') { // Orange Ghost
        const ghost = new Block(orangeGhostImage, x, y, TILE_SIZE, TILE_SIZE);
        ghosts.add(ghost);
      }
      else if (tileMapChar === 'p') { // Pink Ghost
        const ghost = new Block(pinkGhostImage, x, y, TILE_SIZE, TILE_SIZE);
        ghosts.add(ghost);
      }
      else if (tileMapChar === 'r') { // Red Ghost
        const ghost = new Block(redGhostImage, x, y, TILE_SIZE, TILE_SIZE);
        ghosts.add(ghost);
      }
      else if (tileMapChar === 'P') { // Pacman
        pacman = new Block(pacmanRightImage, x, y, TILE_SIZE, TILE_SIZE);
        update();
      }
      else if (tileMapChar === ' ') {
        const food = new Block(null, x + 14, y + 14, 4, 4); // Small food block
        foods.add(food);
      }
    }
  }
}

// document.fonts.ready.then(() => {
//   drawSwitch();  // Draw the switch for toggling features
// });

function drawMarks() {
  // Apply smooth transition style before shifting
  board.style.transition = "ease-in-out 1s";
  // Shift the canvas downward
  boardOffsetY = 100; // match the translateY value
  board.style.transform = `translateY(${boardOffsetY}px)`; // You can adjust this value

  context.font = "14px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (let r = 0; r < ROW_COUNT; r++) {
    for (let c = 0; c < COLUMN_COUNT; c++) {
      const tileMapChar = tileMap[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tileMapChar === 'X') {
        context.font = "14px Arial";
        context.fillStyle = "white";
        context.fillText('X', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      } else if (tileMapChar === ' ') {
        context.font = "10px PixelArial11";
        context.fillStyle = "#e0e0e0";
        //context.fillText('•', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      }
      else if (tileMapChar === 'O') { // Air
        context.font = "18px PixelArial11";
        context.fillStyle = "#e0e0e0";
        context.fillText('air', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      }
    }
  }
}

// Game loop
function update() {
  if (gameOver) return;
  move();
  draw();

  // Uncomment one of the following lines to change the frame rate
  // setTimeout(update, 1000 / 120); // 120 FPS
  // setTimeout(update, 1000 / 90); // 90 FPS
  // setTimeout(update, 1000 / 75); // 75 FPS
  // setTimeout(update, 1000 / 60); // 60 FPS
  // setTimeout(update, 1000 / 50); // 50 FPS
  // setTimeout(update, 1000 / 45); // 45 FPS
  // setTimeout(update, 1000 / 30); // 30 FPS
  // setTimeout(update, 1000 / 20); // 20 FPS
  // setTimeout(update, 1000 / 15); // 15 FPS
  // setTimeout(update, 1000 / 10); // 10 FPS
  // setTimeout(update, 1000 / 5); // 5 FPS
  // setTimeout(update, 1000 / 2); // 2 FPS
  // setTimeout(update, 1000 / 1); // 1 FPS



  updateTimeoutId = setTimeout(update, 1000 / selectedFps); // Use the selected FPS from the dropdown
}

// let hasMeasuredText = false;

// let livesX = 500;
// let livesY = 21;

function draw() {
  // Clear the board
  context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height); // Draw Pacman

  // Draw ghosts
  ghosts.forEach(ghost => {
    context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
  }
  );

  // for (let ghost of ghosts.values()) {
  //   context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
  // }

  // Draw walls
  walls.forEach(wall => {
    context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
  }
  );

  // for (let wall of walls.values()) {
  //   context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
  // }

  // Draw foods
  foods.forEach(food => {
    if (food.image) {
      context.drawImage(food.image, food.x, food.y, food.width, food.height);
    } else {
      context.fillStyle = "yellow"; // Color for the small food
      context.fillRect(food.x, food.y, food.width, food.height);
    }
  }
  );


  // Score
  context.fillStyle = "white";
  context.font = "14px sans-serif";
  context.fillText(`Score: ${score}`, 10, 21); // Display score at the top left corner

  // Lives
  context.fillText(`Lives: ${lives}`, TILE_SIZE / 2 + 532, TILE_SIZE / 2 + 5); // Display lives at the top right corner


  // // Measure and display dimensions
  // const metrics = context.measureText(`Game Over: ${lives}`);
  // if (document.querySelector(".score-info")) {
  //   document.querySelector(".score-info").textContent =
  //     `Position: (${livesX}, ${livesY}) — Width: ${metrics.width.toFixed(1)}px — Height: ${(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent).toFixed(1)}px`;
  // }

  // if (!hasMeasuredText) {
  //   const metrics = context.measureText(`Score: ${score}`);
  //   console.log("Text (Score) width:", metrics.width);
  //   console.log("Text (Score) height:", metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
  //   hasMeasuredText = true; // Set the flag to true after measuring
  // }


  // Check if the game is over
  if (gameOver) {
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    context.fillStyle = "red";
    context.font = "32px sans-serif";
    context.fillText("Game Over: " + String(score), TILE_SIZE / 2 + 200, TILE_SIZE / 2 + 10);
  }

  // context.fillStyle = "white";
  // for (let food of foods.values()) {
  //   context.fillRect(food.x, food.y, food.width, food.height);
  // }

  if (drawMarksFlag) drawMarks();
}

// function convertToPixels(text, xExpression, yExpression) {
//   const x = eval(xExpression.replace(/TILE_SIZE/g, TILE_SIZE));
//   const y = eval(yExpression.replace(/TILE_SIZE/g, TILE_SIZE));
//   return { x, y, text };
// }
// const Over = convertToPixels(
//   "Game Over: " + String(score),
//   "TILE_SIZE / 2 + 250",
//   "TILE_SIZE / 2 + 5"
// );
// const Score = convertToPixels(
//   "Lives: " + String(lives),
//   "TILE_SIZE / 2 + 532",
//   "TILE_SIZE / 2 + 5"
// );

//console.log(Over); // { x: 266, y: 21, text: "Game Over: 0" }
//console.log(Score); // { x: 548, y: 21, text: "Lives: 3" }

function drawSwitch() {
  const uiContainer = document.createElement("div");
  uiContainer.classList.add("ui-container");

  // Create the container label
  const switchLabel = document.createElement("label");
  switchLabel.classList.add("switch");

  // Create the checkbox input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  // Create the slider span
  const sliderSpan = document.createElement("span");
  sliderSpan.classList.add("slider");

  // Assemble the elements
  switchLabel.appendChild(checkbox);
  switchLabel.appendChild(sliderSpan);

  // Append to the body or any other container

  //uiContainer.appendChild(switchLabel);
  document.body.appendChild(uiContainer);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      drawMarksFlag = true;
      boardOffsetY = 100;
      board.style.transform = `translateY(${boardOffsetY}px)`; // Apply shift
      lives = 999;
      drawMarks(); // Call your function when switch is ON
    } else {
      lives = 3;
      drawMarksFlag = false;
      board.style.transform = "translateY(0)"; // Example of undoing a change
      // You can also add a clearOverlay() or redrawBoard() if needed
      resetBoardOffset(); // Reset transform and offset
    }
  });
}

// Helper function to reset the label offset
function resetBoardOffset() {
  boardOffsetY = 0;
  draw();
}


function drawSelector() {
  const uiContainer = document.querySelector(".ui-container");

  // Create the label text
  const labelText = document.createElement("span");
  labelText.textContent = "Frame Rate Selector: ";
  labelText.classList.add("selector-title");

  // Create the container label
  const selectorLabel = document.createElement("label");
  selectorLabel.classList.add("selector");

  // Create the select input
  const select = document.createElement("select");

  // Create the option elements
  ["120 FPS", "90 FPS", "75 FPS", "60 FPS", "50 FPS", "45 FPS", "30 FPS", "20 FPS", "15 FPS", "10 FPS", "5 FPS", "2 FPS", "1 FPS"].forEach(fps => {
    const fpsValue = parseInt(fps);
    const option = document.createElement("option");
    option.value = fpsValue;
    option.textContent = `${fpsValue} FPS`;
    select.appendChild(option);
  });

  select.value = selectedFps; // Set the default value

  // Create the reset button
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset FPS";
  resetButton.classList.add("reset-button");
  resetButton.addEventListener("click", () => {
    selectedFps = 10; // Reset to default FPS
    select.value = selectedFps; // Update the select input
    frameDisplay.textContent = `Current FPS: ${selectedFps}`; // Update the display
    console.log(`FPS reset to: ${selectedFps}`);
  });

  // Create a paragraph to display the current FPS
  frameDisplay = document.createElement("p");
  frameDisplay.textContent = `Current FPS: ${selectedFps}`;
  frameDisplay.classList.add("frame-display");

  // Update the frame display whenever the FPS changes
  select.addEventListener("change", () => {
    selectedFps = parseInt(select.value);
    frameDisplay.textContent = `Current FPS: ${selectedFps}`;
    console.log(`Selected FPS: ${selectedFps}`);
  });


  // Assemble the elements
  selectorLabel.appendChild(labelText);
  selectorLabel.appendChild(select);
  selectorLabel.appendChild(resetButton);

  // Append to the UI container
  uiContainer.appendChild(selectorLabel);
  uiContainer.appendChild(frameDisplay); // Append the frame display paragraph
}


function move() {
  // Local tunnel function for Pacman
  function tunnelPacman() {
    if (pacman.x + pacman.width < 0) {
      pacman.x = BOARD_WIDTH;
    } else if (pacman.x > BOARD_WIDTH) {
      pacman.x = -pacman.width;
    }
  }

  // Local tunnel function for ghosts
  function tunnelGhosts(ghost) {
    if (ghost.x < 0) {
      ghost.x = BOARD_WIDTH - ghost.width;
    } else if (ghost.x + ghost.width > BOARD_WIDTH) {
      ghost.x = 0;
    }
  }


  // Try to turn if aligned with tile center
  if (pacman.nextDirection) {
    const centerX = pacman.x % TILE_SIZE === 0;
    const centerY = pacman.y % TILE_SIZE === 0;

    if ((pacman.nextDirection === 'L' || pacman.nextDirection === 'R') && centerY ||
      (pacman.nextDirection === 'U' || pacman.nextDirection === 'D') && centerX) {
      const oldDirection = pacman.direction;
      pacman.updateDirection(pacman.nextDirection);

      // If direction successfully changed, update image
      if (pacman.direction !== oldDirection) {
        if (pacman.direction === 'U') pacman.image = pacmanUpImage;
        else if (pacman.direction === 'D') pacman.image = pacmanDownImage;
        else if (pacman.direction === 'L') pacman.image = pacmanLeftImage;
        else if (pacman.direction === 'R') pacman.image = pacmanRightImage;
      }
    }
  }

  // Update Pacman's position based on its velocity
  pacman.x += pacman.velocityX;
  pacman.y += pacman.velocityY;

  // Check for collisions with walls
  for (let wall of walls.values()) {
    if (collisionDetection(pacman, wall)) {
      // If there is a collision, revert Pacman's position
      pacman.x -= pacman.velocityX;
      pacman.y -= pacman.velocityY;
      break; // Exit the loop after the first collision
    }
  }

  // Tunnel behavior for Pacman
  if (pacman.y === TILE_SIZE * 9) {
    tunnelPacman();
  }
  // Move each ghost
  for (let ghost of ghosts.values()) {
    // Check for collisions with Pacman
    if (collisionDetection(pacman, ghost)) {
      // If Pacman collides with a ghost, reduce lives and reset positions
      lives -= 1; // Reduce lives by 1

      if (lives == 0) {
        gameOver = true; // Set game over flag if lives reach 0
        console.log("Game Over");
        document.getElementById("restartBtn").style.display = "block";
        return;
      }

      resetPositions(); // Reset positions of Pacman and ghosts

      // Optionally, reset ghosts' positions as well
      for (let ghost of ghosts.values()) {
        ghost.x = ghost.startX;
        ghost.y = ghost.startY;
      }
    }

    // Check to see if the ghost is on the ninth row and change its direction randomly
    // This is a simple logic to change the ghost's direction when it reaches a specific row
    if (ghost.y == TILE_SIZE * 9 && ghost.direction !== 'U' && ghost.direction !== 'D') {
      // If the ghost is on the ninth row, change its direction
      const newDirection = verticalDirections[Math.floor(Math.random() * 2)];
      ghost.updateDirection(newDirection);
    }

    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;

    // Check for collisions with walls
    // for (let wall of walls.values()) {
    //   if (collisionDetection(ghost, wall) || ghost.x < 0 || ghost.x + ghost.width >= BOARD_WIDTH) {
    //     // If there is a collision, revert the ghost's position
    //     ghost.x -= ghost.velocityX;
    //     ghost.y -= ghost.velocityY;
    //     const newDirection = ghostDirections[Math.floor(Math.random() * 4)];
    //     ghost.updateDirection(newDirection); // Change direction randomly
    //     //ghost.updateVelocity(); // Update the velocity based on the new direction
    //     //break; // Exit the loop after the first collision
    //   }
    // }

    // Check for collisions with walls
    for (let wall of walls.values()) {
      if (collisionDetection(ghost, wall)) {
        // If there is a collision, revert the ghost's position
        ghost.x -= ghost.velocityX;
        ghost.y -= ghost.velocityY;
        const newDirection = ghostDirections[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection); // Change direction randomly
        //break; // Exit the loop after the first collision
      }
    }

    // Tunnel behavior for ghost
    if (ghost.y === TILE_SIZE * 9) {
      tunnelGhosts(ghost);
    }
    // Check for collisions with foods
    let foodEaten = null; // Flag to check if food is eaten
    for (let food of foods.values()) {
      if (collisionDetection(pacman, food)) {
        foodEaten = food; // Set the foodEaten flag
        score += 10; // Increase score by 10 for each food eaten
        // If Pacman collides with food, remove the food and increase the score
        console.log(`Score: ${score}`); // Log the score to the console
        break; // Exit the loop after eating one food
      }
    }
    foods.delete(foodEaten);

    // next level
    if (foods.size == 0) {
      drawBoard(tileMap);
      resetPositions();
    }
  }
}

function movePacman(e) {
  let dir = null;

  if (e.code === "ArrowUp" || e.code === "KeyW") dir = 'U'; // Move up
  else if (e.code == "ArrowDown" || e.code == "KeyS") dir = 'D'; // Move down
  else if (e.code == "ArrowLeft" || e.code == "KeyA") dir = 'L'; // Move left
  else if (e.code == "ArrowRight" || e.code == "KeyD") dir = 'R'; // Move right

  if (dir) {
    pacman.nextDirection = dir;
  }

  // Upadate the direction Pacman is facing
  if (dir === 'U') pacman.image = pacmanUpImage;
  else if (dir === 'D') pacman.image = pacmanDownImage;
  else if (dir === 'L') pacman.image = pacmanLeftImage;
  else if (dir === 'R') pacman.image = pacmanRightImage;
}

// Function to check for collision between two rectangles
// a and b are objects with properties: x, y, width, height
// Returns true if there is a collision, false otherwise
function collisionDetection(a, b) {
  return a.x < b.x + b.width &&        // a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x &&        // a's top right corner passes b's top left corner
    a.y < b.y + b.height &&       // a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y;         // a's bottom left corner passes b's top left corner
}

function resetPositions() {
  // Reset Pacman's position to the starting position
  pacman.reset();
  pacman.velocityX = 0; // Reset Pacman's horizontal velocity
  pacman.velocityY = 0; // Reset Pacman's vertical velocity

  for (let ghost of ghosts.values()) {
    // Reset each ghost's position to its starting position
    ghost.reset();

    // Give each ghost a new random direction
    const randomDirection = ghostDirections[Math.floor(Math.random() * 4)]; // 0-3
    ghost.updateDirection(randomDirection);
  }
}

function restartGame() {
  if (updateTimeoutId) {
    clearTimeout(updateTimeoutId); // Cancel previous loop
    updateTimeoutId = null;
  }

  gameOver = false;
  score = 0;
  lives = 3;
  document.getElementById("restartBtn").style.display = "none";
  resetPositions();
  drawBoard(tileMap);
  update();
}

/*
 ~ Todo: Create a class for Pacman and Ghosts, 
 ~ add a method to have the ghosts chase Pacman,
 //~ and add a method to have Pacman eat the food

  ~ Todo: Add a method to have Pacman eat the ghosts when they are vulnerable, 
  ~ and add a method to have the ghosts respawn after being eaten

  //~Todo: Add a method to have the Ghosts and Pacman return to the other side of the map when they reach the edge 
*/

// Class to represent a block in the game
class Block {
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Store the starting position of pacman and the ghosts
    this.startX = x;
    this.startY = y;

    this.direction = 'R'; // Default direction for Pacman

    this.nextDirection = null; // ← new

    this.velocityX = 0; // Horizontal velocity
    this.velocityY = 0; // Vertical velocity


  }

  updateDirection(direction) {
    const previousDirection = this.direction;
    this.direction = direction; // R: Right, L: Left, U: Up, D: Down
    this.updateVelocity();

    this.x += this.velocityX;
    this.y += this.velocityY;

    for (let wall of walls.values()) {
      if (collisionDetection(this, wall)) {
        // If there is a collision, revert to the previous position
        this.x -= this.velocityX;
        this.y -= this.velocityY;
        this.direction = previousDirection; // Revert to the previous direction
        this.updateVelocity(); // Update the velocity based on the previous direction

        return; // Exit the loop after the first collision
      }
    }
  }

  updateVelocity() {
    let val = 8; // 4 -> Adjusted for smoother movement
    switch (this.direction) {
      case "R": this.velocityX = TILE_SIZE / val, this.velocityY = 0; break;
      case "L": this.velocityX = -TILE_SIZE / val, this.velocityY = 0; break;
      case "U": this.velocityX = 0, this.velocityY = -TILE_SIZE / val; break;
      case "D": this.velocityX = 0, this.velocityY = TILE_SIZE / val;
    }
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;

    this.direction = 'R';
    this.velocityX = 0;
    this.velocityY = 0;
  }
}