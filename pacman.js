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

// Function to load the images
function loadImages() {
  // Map of global variable names to their image file names
  const sources = {
    wallImage: "wall.png",

    blueGhostImage: "blueGhost.png",
    orangeGhostImage: "orangeGhost.png",
    pinkGhostImage: "pinkGhost.png",
    redGhostImage: "redGhost.png",

    pacmanUpImage: "pacmanUp.png",
    pacmanDownImage: "pacmanDown.png",
    pacmanLeftImage: "pacmanLeft.png",
    pacmanRightImage: "pacmanRight.png"
  };

  // Base path for all image files
  const path = "./images/";

  // Loop through each key-value pair and assign the image to global variables
  for (const [key, fileName] of Object.entries(sources)) {
    // Create a new Image object
    window[key] = new Image();

    // Set the source path of for the image
    window[key].src = `${path}${fileName}`;
  }
}