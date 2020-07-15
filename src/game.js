var timer;
var direction = "up";
var snake;
var x = 10;
var y = 20;
var segment;
var snakeBlocks = new Array();
var tempDirs = new Array();

Game = {
  //Setting up main grid
  drawGrid: function() {
    var body = document.body, table = document.createElement('table');
    table.setAttribute("id", "grid");
    for(var i = 0; i < y; i++) { 
      var row = table.insertRow();
      for(var j = 0; j < x; j++) {
        var cell = row.insertCell();
      }
      body.appendChild(table);
    }
  },

  //Drawing snake head block
  drawBlock: function(block) {
    var parent = document.getElementById("grid");
    parent.rows[block.y].cells[block.x].style.backgroundColor = "black";
  },

  //Generate snake segment (goal/thing to collect)
  createSegment: function() {
    var x2 = Math.floor((Math.random() * x));
    var y2 = Math.floor((Math.random() * y));

    segment = {x: x2, y: y2};
    var parent = document.getElementById("grid");
    parent.rows[y2].cells[x2].style.backgroundColor = "red";
  },

  //When segment collected
  checkSegment: function() {
    if (snake.x == segment.x && snake.y == segment.y)
    {
        Game.createSegment();
        Game.addChild();
    }
  },

  //Check which key was pressed
  checkKey: function(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
      // up arrow
      if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "down")){
        direction = "up";
      }
    }
    else if (e.keyCode == '40') {
      // down arrow
      if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "up")) {
        direction = "down";
      }
    }
    else if (e.keyCode == '37') {
      // left arrow
      if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "right")){
        direction = "left";
      }
    }
    else if (e.keyCode == '39') {
      // right arrow
      if (snakeBlocks.length == 1 || (snakeBlocks.length > 1 && direction != "left")){
        direction = "right";
      }
    }
  },

  // clear the current block
  clearBlock: function(block) {
    var parent = document.getElementById("grid");
    parent.rows[block.y].cells[block.x].style.backgroundColor = "white";
  },

  //Handle snake movement
  move: function() {
    //Clear old snake head block
    Game.clearBlock(snake)

    // determines the new x and y values when changing direction
    snake.dir = direction;

    switch(direction)
    {
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
    }

    else {
      Game.drawBlock(snake);
      Game.updateSnake(snakeBlocks.length);
      Game.checkSegment();
    }
  },

  //Adding a section to the snake
  addChild: function() {
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
      seg.y = endBlock.x + 1;
      break;

    case "right":
      seg.y = endBlock.y - 1;
      break;
    }

    snakeBlocks.push(seg);
    
  },

  updateSnake: function(len) {
    //Add all directions to tempDirs
    for(let i = 0; i < len; i++) {
      tempDirs.push(snakeBlocks[i].dir);
    }

    //Update snake segment directions
    for(let i = 1; i < len; i++) {
      snakeBlocks[i].dir = tempDirs[i-1];
    }
    //console.log(snakeBlocks);
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

    //console.log(snakeBlocks)

    //Visuals
    for(let i = 1; i < len; i++) {
      console.log(snakeBlocks[i])
      Game.clearBlock(snakeBlocks[i])
      Game.drawBlock(snakeBlocks[i])
    }


  },


  //Game timer starts
  start: function() {
    Game.createSegment();
    document.onkeydown = Game.checkKey;
    timer = setInterval(function(){Game.move();}, 400);
    snakeBlocks.push(snake);
  },

  // Initialize and start our game
  load: function() {
    Game.drawGrid();
    var parent = document.getElementById("grid");
    snake = {y: Math.floor(Math.random() * y), x: Math.floor(Math.random() * x), dir: direction};
    Game.drawBlock(snake);
    Game.start();
  }
  
}
