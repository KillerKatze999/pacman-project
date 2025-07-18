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
    { name: "Red Ghost", image: redGhostImage },
  ];

  imageStatus.forEach(({ name, image }) => {
    if (!image.complete || image.naturalWidth === 0) {
      console.error(`❌ ${name} image failed to load or draw.`);
    } else {
      console.log(`✅ ${name} image loaded and drawable.`);
    }
  });


  // const imageStatus = [
  //   { name: "Wall", image: wallImage },
  //   { name: "Pacman Up", image: pacmanUpImage },
  //   { name: "Pacman Down", image: pacmanDownImage },
  //   { name: "Pacman Left", image: pacmanLeftImage },
  //   { name: "Pacman Right", image: pacmanRightImage },
  //   { name: "Blue Ghost", image: blueGhostImage },
  //   { name: "Orange Ghost", image: orangeGhostImage },
  //   { name: "Pink Ghost", image: pinkGhostImage },
  //   { name: "Red Ghost", image: redGhostImage },
  // ];

  // imageStatus.forEach(({ name, image }) => {
  //   if (!image.complete || image.naturalWidth === 0) {
  //     console.error(`❌ ${name} image failed to load or draw.`);
  //   } else {
  //     console.log(`✅ ${name} image loaded and drawable.`);
  //   }
  // });
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

let imageDrawChecked = false;
// Game loop
function update() {
  // move();
  draw();

  // Uncomment one of the following lines to change the frame rate
  // setTimeout(update, 1000 / 120); // 120 FPS
  // setTimeout(update, 1000 / 90); // 90 FPS
  // setTimeout(update, 1000 / 75); // 75 FPS
  // setTimeout(update, 1000 / 60); // 60 FPS
  setTimeout(update, 1000 / 50); // 50 FPS
  // setTimeout(update, 1000 / 45); // 45 FPS
  // setTimeout(update, 1000 / 30); // 30 FPS
  // setTimeout(update, 1000 / 20); // 20 FPS
  // setTimeout(update, 1000 / 15); // 15 FPS
  // setTimeout(update, 1000 / 10); // 10 FPS
  // setTimeout(update, 1000 / 5); // 5 FPS
  // setTimeout(update, 1000 / 2); // 2 FPS
  // setTimeout(update, 1000 / 1); // 1 FPS
}


function draw() {
  context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height); // Draw Pacman

  // Draw ghosts
  ghosts.forEach(ghost => {
      context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
  );

  // Draw walls
  walls.forEach(wall => {
      context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
  );

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
}
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
  
  
  }
}



