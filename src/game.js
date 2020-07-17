//REFERENCE: https://www.thatsoftwaredude.com/content/6193/coding-the-snake-game-in-javascript

//VARIABLES
var timer, snake, segment;
var direction = "up";
var x = 10;
var y = 20;
var snakeBlocks = new Array();
var tempDirs = new Array();
var snakeColor = "#75ba6d";
var timeInterval = 400;

//FUNCTIONS
//Setting up main grid
function drawGrid() {
  var body = document.body, table = document.createElement('table');
  table.setAttribute("id", "grid");
  for(var i = 0; i < y; i++) { 
    var row = table.insertRow();
    for(var j = 0; j < x; j++) {
      var cell = row.insertCell();
    }
    body.appendChild(table);
  }
}

//Drawing blocks
function drawBlock(block) {
  var parent = document.getElementById("grid");
  parent.rows[block.y].cells[block.x].style.backgroundColor = snakeColor;
}

//Generate snake segment (goal/thing to collect)
  function createSegment() {
  var x2 = Math.floor((Math.random() * x));
  var y2 = Math.floor((Math.random() * y));
  let valid = true;
  for(let i = 0; i < snakeBlocks.length; i++) {
    if(x2 == snakeBlocks[i].x && y2 == snakeBlocks[i].y) {
      valid = false;
    }
  }
  if(valid==true) {
    segment = {x: x2, y: y2};
    var parent = document.getElementById("grid");
    parent.rows[y2].cells[x2].style.backgroundColor = "red";
  } else {
    createSegment();
  }
}

//When segment collected
function checkSegment() {
  if (snake.x == segment.x && snake.y == segment.y) {
      createSegment();
      addChild();
  }
}

//Check which key was pressed
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "down")){
      direction = "up";
    }
  } else if (e.keyCode == '40') {
    // down arrow
    if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "up")) {
      direction = "down";
    }
  } else if (e.keyCode == '37') {
    // left arrow
    if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "right")){
      direction = "left";
    }
  } else if (e.keyCode == '39') {
    // right arrow
    if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "left")){
      direction = "right";
    }
  }
}

// clear the current block
function clearBlock(block) {
  var parent = document.getElementById("grid");
  parent.rows[block.y].cells[block.x].style.backgroundColor = "white";
}

//Handle snake movement
function move() {
  //Clear old snake head block
  clearBlock(snake)

  //Update the snake body and check if head runs into tail
  checkCollision();
  updateSnake(snakeBlocks.length);

  // determines the new x and y values when changing direction
  snake.dir = direction;

  switch(direction) {
    case "up":
      snake.y--;
      break;

    case "down":
      snake.y++;
      break;

    case "left":
      snake.x--;
      break;

    case "right":
      snake.x++;
      break;
  }

  // edge detection. game ends if this happens
  if (snake.x < 0 || snake.y < 0 || snake.x >= x || snake.y >= y) {
    document.getElementById("title").innerHTML = "Lost";
    clearInterval(timer);
  } else {
    drawBlock(snake);
    checkSegment();
  }
  //Set timer interval
  timeInterval = 400-(snakeBlocks.length*5);
  if (timeInterval < 100) {
    timeInterval = 100;
  }
  console.log(timeInterval);
}

//Adding a section to the snake
function addChild() {
  let endBlock = snakeBlocks[snakeBlocks.length-1];
  var seg = {
    //calculate coordinates based on direction
    y: endBlock.y,
    x: endBlock.x,
    dir: endBlock.dir
  }
  switch(seg.dir) {
    case "up":
      seg.y = endBlock.y + 1;
      break;

    case "down":
      seg.y = endBlock.y - 1;
      break;

    case "left":
      seg.x = endBlock.x + 1;
      break;

    case "right":
      seg.x = endBlock.x - 1;
      break;
  }
  snakeBlocks.push(seg);    
}

function updateSnake(len) {
  //Add all directions to tempDirs
  for(let i = 0; i < len; i++) {
    tempDirs.push(snakeBlocks[i].dir);
  }

  //Update snake segment directions
  for(let i = 1; i < len; i++) {
    clearBlock(snakeBlocks[i])
    snakeBlocks[i].dir = tempDirs[i-1];
  }
  tempDirs = [];

  //Update snake segment coordinates
  for(let i = 1; i < len; i++) {
    switch(snakeBlocks[i].dir) {
      case "up":
        snakeBlocks[i].y--;
        break;

      case "down":
        snakeBlocks[i].y++;
        break;

      case "left":
        snakeBlocks[i].x--;
        break;

      case "right":
        snakeBlocks[i].x++;
        break;
    }
  }
  //Visuals
  for(let i = 1; i < len; i++) {
    drawBlock(snakeBlocks[i])
  }
}

//Check if snake collides with tail
function checkCollision() {
  for(let i = 1; i < snakeBlocks.length; i++) {
    if((snakeBlocks[i].x == snake.x) && (snakeBlocks[i].y == snake.y)) {
      document.getElementById("title").innerHTML = "Lost";
      clearInterval(timer);
    }
  }
}

//Game timer starts
function start() {
  createSegment();
  document.onkeydown = checkKey;
  timer = setInterval(function(){move();}, timeInterval);
  snakeBlocks.push(snake);
}

// Initialize and start our game
function load() {
  drawGrid();
  var parent = document.getElementById("grid");
  snake = {y: Math.floor(Math.random() * y), x: Math.floor(Math.random() * x), dir: direction};
  drawBlock(snake);
  start();
}