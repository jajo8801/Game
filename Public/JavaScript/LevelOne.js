// This code is derived from a demo located here: https://editor.p5js.org/Jesaltriv/sketches/S1y1ofeJe
//**This has been modified and turned into a game by Jacob Johnson**

var level = {rects: [], circles: [], numRects: 50, numEnemies: 25, numFriendly: 25,
  score: 0, complete: false, sizeX : 1250, sizeY: 500, timeStart: 0,
  timeEnd: 0, won: false, currentLevel: 1, access: false};

var cir;

let bgColor = 255;
let hitColor = 255;
let cursorColor = 1;
let cursorDefault = 1;
let cursorX = 0;
let cursorY = 0;


function setup() {


	level = loadLevel();

	createCanvas(level.sizeX, level.sizeY);
	//numRects = random(10,1000).toFixed(0);

	for(i=0;i<level.numRects;i++){
		e = new rectObj(random(width),random(height), random(30,50), random(30,50), true) // generate a rectObj
    f = new rectObj(random(width),random(height), random(30,50), random(30,50), false) // generate a rectObj
		level.rects.push(e); //add it to the array.
    level.rects.push(f);
	}

	cir = new circleObj(50);// create a new circle object

	console.log(level.rects);

	level.timeStart = Date.now();

  cursorX = mouseX;
  cursorY = mouseY;

}

function draw(){


	background(bgColor);
  angleMode(DEGREES);

	if(!level.complete){
			for(i=0;i<level.numRects;i++){
			level.rects[i].disp();
			level.rects[i].collide( cir ); //collide against the circle object
		}

		cir.disp(mouseX,mouseY); //pass the x,y pos in to the circle.
    //cir.disp(cursorX, cursorY); // Use for gamepad
		dispScore(false);

	}else{
		dispScore(true);
	}
}


function keyPressed() {
  // Key = 1
  // Toggle Background color
  if (keyCode === 49) {
    if(bgColor === 255){
      bgColor = 0;
      hitColor = 0;
      // Fill in shapes already hit
      fillHits(0);
      cursorDefault = 255;
      cir.color = cursorDefault;

    }else{
      bgColor = 255;
      hitColor = 255;
      // Fill in shapes already hit
      fillHits(255);
      cursorDefault = 0;
      cir.color = cursorDefault;



    }
  }

  // Key = 2
  // Toggle shape
  else if (keyCode === 50) {
    if (level.rects[0].changeShape){
      console.log("CS true");
      rotateEnemies(false);
    }else{
      rotateEnemies(true);
      console.log("CS false");
    }

  }

  // Key = 3
  // Toggle Mouse color
  else if (keyCode === 51){
    if(cursorColor === 0){
      cursorColor = color(random(255), random(255), random(255));
      cir.color = cursorColor;
    }else{
      cursorColor = cursorDefault;
      cir.color = cursorColor;
    }
  }
}

// Fill in shapes already hit with incoming color
function fillHits(color){
  for (var i = 0; i < level.rects.length; i++) {
    if(level.rects[i].hasBeenHit){
      level.rects[i].color = color;
    }
  }
}


function rotateEnemies(isRotated){
  for (var i = 0; i < level.rects.length; i++) {
    if(level.rects[i].isEnemy){
      level.rects[i].changeShape = isRotated;
    }
  }
}


function dispScore(finished){
	if(finished){
		//Delta time and score
		level.timeEnd = Date.now();
		var dTime = getDeltaTime();
		var finalScore = ((level.numRects-dTime)).toFixed(0);


		//End the draw loop, change text to centered and green
		noLoop();
		fill(color(0,255,0));
		textSize(50);
		textAlign(CENTER);

		//Displays win/lose and stats message
		if(finalScore>0){
			text("You won!", level.sizeX/2, level.sizeY/2);


		}else{
			text("You lost!", level.sizeX/2, level.sizeY/2);
		}

		text("It took you " + dTime + " seconds!",  level.sizeX/2, (level.sizeY/2) - 60);
		text("Your score is: " + finalScore, level.sizeX/2, level.sizeY/2 + 60);
		text("Click to continue!", level.sizeX/2, level.sizeY/2 + 120);

		level.won = true;

	}else{
		//Update score
		fill(color(255,0,0));
		text("Score: " + level.score + "/" + level.numRects, 50,50);
	}

}

function getDeltaTime(){
	var totalTime = level.timeEnd - level.timeStart;						//Time difference
	totalTime = totalTime / 1000 + (totalTime % 1000)/1000;		//Convert milliseconds to seconds
	return totalTime.toFixed(3);								//Round seconds to 3 decimal place

}


function rectObj(x, y, w, h, isEnemy){
	this.x = x
	this.y = y
	this.w = w
	this.h = h
  this.rotated = false;
	this.hit = false;
	this.hasBeenHit = false;
  this.changeShape = false;
  this.isEnemy = isEnemy;


  if(this.isEnemy){
    this.color = color(255, 0, 0)
  }else{
    this.color = color(0, 0, 255)
  }

	this.collide = function(obj){

    if(this.changeShape){
      this.hit = collideCircleCircle(this.x, this.y, this.w, obj.x, obj.y, obj.dia); //collide the cir object into this circle object.

    }else{
      this.hit = collideRectCircle(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.dia); //collide the cir object into this rectangle object.
    }


		if(this.hit){
			this.color = color(hitColor) //set this rectangle to be the background color if it gets hit

      if(this.isEnemy){

        //Score tracker
  			if(!this.hasBeenHit){
  				level.score += 1;
          level.numEnemies -= 1;
  				this.hasBeenHit = true;

          // All enemies destroyed?
  				if(level.numEnemies <= 0){
  					level.complete = true;
  				}
  			}
      }
      else{
        if(!this.hasBeenHit){
          // Animation when friendly is hit??
          level.score -= 1;
          this.hasBeenHit = true;
          level.numFriendly -= 1;
        }
      }

		}
	}

	this.disp = function(){
		noStroke();
		fill(this.color);
		this.x += 3 //move to the right!
		if(this.x > width){ //loop to the left!
			this.x = -this.w;
		}
    if(this.changeShape){
      ellipse(this.x, this.y, this.w, this.w);
    }else{
      rect(this.x,this.y,this.w,this.h);
    }

	}
}

function circleObj(dia){
	this.dia = dia;
	this.color = color(cursorColor);
	this.x;
	this.y;

	this.disp = function(x,y){
		this.x = x;
		this.y = y;
		noStroke();
		fill(this.color);
		ellipse(this.x,this.y,this.dia,this.dia);
	}

}


function mouseClicked() {
  if (level.won) {
  	//window.location.reload(false);
		//level.won = false;

    level.currentLevel += 1;
    var mapIt = {1: "/LevelOne", 2: "/LevelTwo", 3: "/LevelThree", 4: "/LevelFour", 5: "/LevelFive", 6: "/"};
    console.log(mapIt[level.currentLevel])
    window.location.href = mapIt[level.currentLevel];

  }else{
    window.location.reload();
  }
}

function loadLevel(){
	/*
	var level = {rects: [], numRects: 50, score: 0,
		complete: false, sizeX : 1500, sizeY: 750, timeStart: 0,
		timeEnd: 0, won: false, currentLevel: 0, access: false};
	*/
  /*level = {rects: [], circles: [], numRects: 100, numEnemies: 50, numFriendly: 50,
    score: 0, complete: false, sizeX : 1500, sizeY: 750, timeStart: 0,
		timeEnd: 0, won: false, currentLevel: url, access: false};
    */
  var mapIt = {'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5}
  level.currentLevel = mapIt[document.location.pathname.replace("/Level", "")];

  // Adjust based on level
	if(level.currentLevel == 1){
		return level;
	}else if (level.currentLevel == 2) {
		level.numRects = 100;
	}else if (level.currentLevel == 3) {
		level.numRects = 200;
	}else if (level.currentLevel == 4) {
		level.numRects = 300;
  }else if (level.currentLevel == 5) {
		level.numRects = 400;
  }

  // Set the number of enemies and friendlies
  level.numEnemies = level.numRects/2;
  level.numFriendly = level.numRects/2;

  return level;

}

var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
  cursorX = 0;
  cursorY = 0;
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);

  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);

  var a = document.createElement("div");
  a.className = "axes";

  for (var i = 0; i < gamepad.axes.length; i++) {
    var p = document.createElement("progress");
    p.className = "axis";
    //p.id = "a" + i;
    p.setAttribute("max", "2");
    p.setAttribute("value", "1");
    p.innerHTML = i;
    a.appendChild(p);
  }

  d.appendChild(a);

  // See https://github.com/luser/gamepadtest/blob/master/index.html
  var start = document.getElementById("start");
  if (start) {
    start.style.display = "none";
  }

  document.body.appendChild(d);
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
  cursorX = mouseX;
  cursorY = mouseY;
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  var i = 0;
  var j;

  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);

    var axes = d.getElementsByClassName("axis");


    // Jacob Johnson Code
    if (controller.axes[0] > 0 || controller.axes[0] < -0.4){
      if (controller.axes[0] > 0){
        cursorX += 2;
      }else{
        cursorX -= 2;
      }
    }

    if (controller.axes[1] > 0 || controller.axes[1] < -0.4){
      if (controller.axes[1] > 0){
        cursorY += 2;
      }else{
        cursorY -= 2;
      }
    }

  }

  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
}
