// Board Setup
let board;
const TILE_SIZE = 32;
const ROW_COUNT = 21;
const COLUMN_COUNT = 19;
const BOARD_WIDTH = COLUMN_COUNT * TILE_SIZE;
const BOARD_HEIGHT = ROW_COUNT * TILE_SIZE;
let context;

// Game Asset Images
let wallImage;

let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;

let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;

// Flag to toggle the drawing of marks
let drawMarksFlag = false;

// Default frame rate
// This can be changed by the user through a selector
let selectedFps = 20;
let frameDisplay; // Paragraph for displaying FPS


// Displays the board when the page is loaded
window.onload = function () {
  board = document.getElementById('board');

  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;

  context = board.getContext("2d"); // used for drawing on the board

  loadImages();
  drawBoard();

  update();

  setTimeout(() => {
    checkImageDrawStatus();
  }, 200); // Give time for images to be drawn


  // Print the size of all sets for debugging
  ensureCorrectAmounts();

  drawSwitch(); // Draw the switch for toggling features
  drawSelector(); // Draw the selector for options

  // Add key event listener
  document.addEventListener("keyup", movePacman);
}

// Check if the number of walls, foods, and ghosts matches the expected amounts
function ensureCorrectAmounts() {
  const wallsAmount = 196;
  const foodsAmount = 184;
  const ghostsAmount = 4;

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


const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;


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

function drawBoard() {
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
  board.style.marginTop = "100px"; // You can adjust this value

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
        context.fillText('•', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
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



  setTimeout(update, 1000 / selectedFps); // Use the selected FPS from the dropdown
}


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

  // context.fillStyle = "white";
  // for (let food of foods.values()) {
  //   context.fillRect(food.x, food.y, food.width, food.height);
  // }

  if (drawMarksFlag) {
    drawMarks();
  }
}

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

  uiContainer.appendChild(switchLabel);
  document.body.appendChild(uiContainer);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      drawMarksFlag = true;
      drawMarks(); // Call your function when switch is ON
    } else {
      drawMarksFlag = false;
      board.style.marginTop = "0px"; // Example of undoing a change
      // You can also add a clearOverlay() or redrawBoard() if needed
    }
  });
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
    selectedFps = 20; // Reset to default FPS
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
}

function movePacman(e) {
  if (e.code == "ArrowUp" || e.code == "KeyW") {
    pacman.updateDirection('U'); // Move up
  }
  else if (e.code == "ArrowDown" || e.code == "KeyS") {
    pacman.updateDirection('D'); // Move down
  }
  else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    pacman.updateDirection('L'); // Move left
  }
  else if (e.code == "ArrowRight" || e.code == "KeyD") {
    pacman.updateDirection('R'); // Move right
  }
}

function collisionDetection(a, b) {
  return  a.x < b.x + b.width &&        // a's top left corner doesn't reach b's top right corner
          a.x + a.width > b.x &&        // a's top right corner passes b's top left corner
          a.y < b.y + b.height &&       // a's top left corner doesn't reach b's bottom left corner
          a.y + a.height > b.y;         // a's bottom left corner passes b's top left corner
}





//~ Todo: Create a class for Pacman and Ghosts



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
    switch (this.direction) {
      case 'R':
        this.velocityX = TILE_SIZE / 4; // Adjusted for smoother movement
        this.velocityY = 0;
        break;
      case 'L':
        this.velocityX = -TILE_SIZE / 4; // Adjusted for smoother movement
        this.velocityY = 0;
        break;
      case 'U':
        this.velocityX = 0;
        this.velocityY = -TILE_SIZE / 4; // Adjusted for smoother movement
        break;
      case 'D':
        this.velocityX = 0;
        this.velocityY = TILE_SIZE / 4; // Adjusted for smoother movement
        break;
    }
  }
}

