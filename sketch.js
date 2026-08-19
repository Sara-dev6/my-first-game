/*

Game project 


*/

// declare variables 
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var isFound;


var trees_x;
var treePos_y;

var clouds;
var mountains;
var birds;

var cameraPosX;
var collectables;
var canyons;

var game_score;
var flagpole;

var lives;

var platforms;
var enemies;

var jumpSound;
var bgMusic;
var coinSound;
var falling; 
var winning;

var timer;
var gameState;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.05);
    bgMusic= loadSound('assets/bgMusic.wav');
	bgMusic.setVolume(0.02);
    coinSound= loadSound('assets/coin.wav');
	coinSound.setVolume(0.1);
	falling = loadSound('assets/falling.wav');
	falling.setVolume(0.1);
	winning = loadSound('assets/win.wav');
	winning.setVolume(0.1);
	gameOver=loadSound('assets/game over.wav');
	gameOver.setVolume(0.1);
	warning = loadSound('assets/warning.wav');
	warning.setVolume(0.1);
	
}

function setup()
{
	createCanvas(1024, 576);
	// initialize variables
    floorPos_y = height * 3 / 4;
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	collectables =[ 
		{ x_pos: 230, y_pos: floorPos_y-30, size: 50, isFound: false },
        {x_pos: 430, y_pos: floorPos_y-30, size: 50, isFound: false },
		{x_pos: 70, y_pos: floorPos_y-125, size: 50, isFound: false }, 
		{x_pos: 100, y_pos: floorPos_y-125, size: 50, isFound: false }, 
		{x_pos: 850, y_pos: floorPos_y-30, size: 50, isFound: false },
        {x_pos: 1325, y_pos: floorPos_y-125 , size: 50, isFound: false },
	]
	canyons = [
		{ x_pos: 100, width: 100 },
        { x_pos: 540, width: 60 },
		{ x_pos: 940, width: 80 },
		{ x_pos: 1190, width: 110 }
	]
	trees_x = [300, 500, 900, 1150]
    treePos_y= floorPos_y-220;
	
	clouds = [
		{ x_pos: 200, y_pos: 400, size: 80 },
		{ x_pos: 400, y_pos: 400, size: 60 },
		{ x_pos: 750, y_pos: 400, size: 60 },
		{ x_pos: 950, y_pos: 400, size: 60 },
		{ x_pos: 0, y_pos: 400, size: 60 }
	]
	mountains = [
		{ x_pos: 700, y_pos: 300 },
		{ x_pos: 300, y_pos: 300 },
		{ x_pos: 1000, y_pos: 300 }
	]; 
	birds = [
		{x_pos:300, y_pos: 300},
		{x_pos:600, y_pos: 320},
		{x_pos:650, y_pos: 300}
	]

	platforms= [];
	platforms.push(createPlatforms(0,floorPos_y-100,150));
    platforms.push(createPlatforms(500,floorPos_y-100,100));
    platforms.push(createPlatforms(1300,floorPos_y-100,100));

	enemies = [];
	enemies.push(new Enemy(-70,floorPos_y,90))
    enemies.push(new Enemy(1050,floorPos_y,100))
	cameraPosX = 0;

	game_score = 0;
	
	flagpole = {isReached: false , x_pos: 1500};

	lives = 3;

	// background music 
	if (!bgMusic.isPlaying()) {
     bgMusic.loop();
}
    timer=20;
	gameState =0;
}

function draw() {
	cameraPosX = gameChar_x - width / 2
	///////////DRAWING CODE//////////
    drawBackGround();
	push();
	translate(-cameraPosX, 0);
	////calling functions////
	drawMountains(); 
	drawTrees();
	drawClouds(); 
	drawBirds();

     //call platforms function 
	for(var i = 0; i<platforms.length; i++)
	{
		platforms[i].draw()
	}

	// collectable item 
    for(var i = 0; i< collectables.length; i++)
	{
	drawCollectable(collectables[i]);
	checkCollectable(collectables[i]);
    }
	//draw  canyons
    for(var i = 0; i< canyons.length; i++)
    {
	drawCanyon(canyons[i]);
	checkCanyon(canyons[i]);
    }

    renderFlagpole();
	drawUserInterface();// draw the User Interface: lives, score, timer
	drawGameChar();// game charcter
	checkEnemies();// Enemies

	// make an intro for my game 
     if(gameState==0)
	{
	   showIntroScreen();  
    }
   // game over 
	if (lives < 1 && !flagpole.isReached || timer===0 )
	{   
		showGameOverScreen();
	}
	// create a background when the player win 
	else if(flagpole.isReached && lives> 0 )
	{
		showWinSreen();
	}
	pop();
    
	///////////INTERACTION CODE//////////
	 GameInteraction();
    // check flagpole if it hasn’t been reached yet
	if(flagpole.isReached == false)
	{
	checkFlagpole();
	}
	
	//check if the player died
	checkPlayerDie();
	
}

function keyPressed() {
	// start the game when space is pressed  
	if(keyCode == 32 && gameState==0)
	{
		gameState=1 
	}

    if(gameState==1)
	{
	//move left 
	if (keyCode == 37) {
		console.log("left arrow");
		isLeft = true;
	}
	// move right
	else if (keyCode == 39) {
		console.log("right arrow");
		isRight = true;
	}
	// jump 
	else if (keyCode == 32 && !isFalling && isPlummeting == false && gameChar_y === floorPos_y) {
		console.log("space") 
		gameChar_y -= 100;
        jumpSound.play();
	}
}
   

}

function keyReleased() {

    // stop moving left when the key is released
	if (keyCode == 37) {
		console.log("left arrow")
		isLeft = false;
	}
	// stop moving right when the key is released
	else if (keyCode == 39) {
		console.log("right arrow ")
		isRight = false;

	}

}

function showIntroScreen()
{
	background(255,255,255,180);
	fill(0);
	textSize(50);
	stroke(0);
	strokeWeight(4);
	text("press space to start",300, height/2);
}

function drawBackGround()
{
	background(100, 155, 255);  //fill the sky blue
	
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
}

function drawClouds()
{
	for (var i = 0; i < clouds.length; i++) {
		

		fill(255);
		ellipse(clouds[i].x_pos - 5, clouds[i].y_pos - 300, clouds[i].size + 30);
		ellipse(clouds[i].x_pos - 50, clouds[i].y_pos - 300, clouds[i].size + 20);
		ellipse(clouds[i].x_pos + 40, clouds[i].y_pos - 300, clouds[i].size + 20);
		ellipse(clouds[i].x_pos - 27, clouds[i].y_pos - 330, clouds[i].size + 10);
		ellipse(clouds[i].x_pos + 17, clouds[i].y_pos - 330, clouds[i].size + 10);
	}
}

function drawMountains()
{
	for (var i = 0; i < mountains.length; i++) {
		// console.log("mountains loop" + i)
		fill(139, 69, 19);
		triangle(mountains[i].x_pos - 70, mountains[i].y_pos + 132, mountains[i].x_pos + 90, mountains[i].y_pos + 132, mountains[i].x_pos + 15, mountains[i].y_pos - 100);
		triangle(mountains[i].x_pos, mountains[i].y_pos + 132, mountains[i].x_pos + 200, mountains[i].y_pos + 132, mountains[i].x_pos + 100, mountains[i].y_pos - 200);
	}

}

function drawTrees()
{
	for (var i = 0; i < trees_x.length; i++) {
		
		fill(101, 67, 33);
		rect(trees_x[i], treePos_y, 40, 220);

		fill(34, 139, 34);
		triangle(trees_x[i] - 50, treePos_y + 20, trees_x[i] + 90, treePos_y + 20, trees_x[i] + 20, treePos_y - 70);
		triangle(trees_x[i] - 50, treePos_y + 65, trees_x[i] + 90, treePos_y + 65, trees_x[i] + 20, treePos_y - 50);
		triangle(trees_x[i] - 50, treePos_y + 90, trees_x[i] + 90, treePos_y + 90, trees_x[i] + 20, treePos_y - 50);

	}
	
}

function drawBirds()
{
	for(var i = 0; i< birds.length; i++)
	{
		fill(100,155,255);
	  rect(100,432,100,200);
   
	
	stroke(0);
	strokeWeight(2);
	fill(0,0,0,0)
	arc(birds[i].x_pos+10 , birds[i].y_pos, 20, 10, PI, TWO_PI);
	arc(birds[i].x_pos -10, birds[i].y_pos, 20, 10, PI, TWO_PI);


	birds[i].x_pos += 2

	if(birds[i].x_pos> width+ cameraPosX)
	{
		birds[i].x_pos = -100 + cameraPosX;
	}
	noStroke();
	}
}

function drawCollectable(t_collectable)
{
	checkCollectable(collectables);
}

function drawCanyon(t_canyon)
{
    checkCanyon(t_canyon)
}

function drawGameChar()
{
	////////the game character/////////
	if (isLeft && isFalling) {
		// add your jumping-left code
		//body 
		fill(255, 0, 0);
		rect(gameChar_x - 15, gameChar_y - 40, 20, 25);

		// Left arm back
		fill(255, 224, 189);
		rect(gameChar_x -20, gameChar_y - 40, 25, 8);

		// left leg 
		fill(255, 224, 189);
		rect(gameChar_x - 10, gameChar_y - 16, 8, 15);
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 16, 8, 10);
		fill(0); // shose 
		rect(gameChar_x - 12, gameChar_y - 8, 10, 8);

		fill(255, 224, 189); // head 
		ellipse(gameChar_x - 5, gameChar_y - 52, 25, 25);

		fill(255); // eye
		ellipse(gameChar_x - 10, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 53, 3);
		// mouth
		fill(255);
		arc(gameChar_x - 10, gameChar_y - 47, 15, 10, 0, PI);

		fill(60, 40, 20); // hat 
		arc(gameChar_x - 5, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x - 5, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x - 5, gameChar_y - 65, 10, 10);

	}

	else if (isRight && isFalling) {
		// add your jumping-right code
		//body 
		fill(255, 0, 0);
		rect(gameChar_x - 5, gameChar_y - 40, 20, 25);

		// Left arm back
		fill(255, 224, 189);
		rect(gameChar_x, gameChar_y - 40, 25, 8);

		// left leg 
		fill(255, 224, 189);
		rect(gameChar_x + 5, gameChar_y - 16, 8, 15);
		fill(0);
		rect(gameChar_x + 5, gameChar_y - 16, 8, 10);

		fill(0); // shose 
		rect(gameChar_x + 8, gameChar_y - 8, 10, 8);

		fill(255, 224, 189); // head 
		ellipse(gameChar_x + 8, gameChar_y - 52, 25, 25);

		fill(255); // eye
		ellipse(gameChar_x + 13, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x + 13, gameChar_y - 53, 3);
		// mouth
		fill(255);
		arc(gameChar_x + 13, gameChar_y - 47, 15, 10, 0, PI);

		fill(60, 40, 20); // hat 
		arc(gameChar_x + 8, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x + 8, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x + 8, gameChar_y - 65, 10, 10);


	}

	else if (isLeft) {
		// add your walking left code
		//body 
		fill(255, 0, 0);
		rect(gameChar_x - 15, gameChar_y - 40, 20, 25);

		// Left arm back
		fill(255, 224, 189);
		rect(gameChar_x - 5, gameChar_y - 40, 8, 25);

		// left leg 
		fill(255, 224, 189);
		rect(gameChar_x - 10, gameChar_y - 16, 8, 15);
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 16, 8, 10);
		fill(0); // shose 
		rect(gameChar_x - 12, gameChar_y - 8, 10, 8);

		fill(255, 224, 189); // head 
		ellipse(gameChar_x - 5, gameChar_y - 52, 25, 25);

		fill(255); // eye
		ellipse(gameChar_x - 10, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 53, 3);
		// mouth
		fill(255);
		arc(gameChar_x - 10, gameChar_y - 47, 15, 10, 0, PI);

		fill(60, 40, 20); // hat 
		arc(gameChar_x - 5, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x - 5, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x - 5, gameChar_y - 65, 10, 10);

	}

	else if (isRight) {
		// add your walking right code
		//body 
		fill(255, 0, 0);
		rect(gameChar_x - 5, gameChar_y - 40, 20, 25);

		// Left arm back
		fill(255, 224, 189);
		rect(gameChar_x + 5, gameChar_y - 40, 8, 25);

		// left leg 
		fill(255, 224, 189);
		rect(gameChar_x + 5, gameChar_y - 16, 8, 15);
		fill(0);
		rect(gameChar_x + 5, gameChar_y - 16, 8, 10);

		fill(0); // shose 
		rect(gameChar_x + 8, gameChar_y - 8, 10, 8);

		fill(255, 224, 189); // head 
		ellipse(gameChar_x + 8, gameChar_y - 52, 25, 25);

		fill(255); // eye
		ellipse(gameChar_x + 13, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x + 13, gameChar_y - 53, 3);
		// mouth
		fill(255);
		arc(gameChar_x + 13, gameChar_y - 47, 15, 10, 0, PI);

		fill(60, 40, 20); // hat 
		arc(gameChar_x + 8, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x + 8, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x + 8, gameChar_y - 65, 10, 10);

	}

	else if (isFalling || isPlummeting) {
		// add your jumping facing forwards code
    
    stroke(150);
	strokeWeight(2);
	for(var i = 0; i <5; i++){
		line(gameChar_x-10 + i*5,
			gameChar_y+ 15,
			gameChar_x-15 + i*5,
			gameChar_y+ 25
		)
	}
	    noStroke();
		fill(255, 224, 189); // head 
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		fill(255, 0, 0); // body (t-shirt)
		rect(gameChar_x - 10, gameChar_y - 43, 20, 23);

		fill(255, 224, 189);// the right leg 
		rect(gameChar_x, gameChar_y - 24, 8, 15);
		fill(0);
		rect(gameChar_x, gameChar_y - 24, 8, 10);

		fill(255, 224, 189);// the left leg 
		rect(gameChar_x - 10, gameChar_y - 24, 8, 15);
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 24, 8, 10);

		fill(0); // shose 
		rect(gameChar_x - 2, gameChar_y - 8, 10, 8);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 8);

		fill(255, 224, 189);// right  hand 
		rect(gameChar_x + 10, gameChar_y - 65, 5, 25);

		fill(255, 224, 189); // left hand 
		rect(gameChar_x - 15, gameChar_y - 65, 5, 25);

		fill(255); // eye
		ellipse(gameChar_x + 5, gameChar_y - 53, 8);
		ellipse(gameChar_x - 5, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x + 5, gameChar_y - 53, 3);
		ellipse(gameChar_x - 5, gameChar_y - 53, 3);
		//smile
		fill(255);
		arc(gameChar_x, gameChar_y - 47, 15, 10, 0, PI);
		//hat
		fill(60, 40, 20);
		arc(gameChar_x, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x, gameChar_y - 65, 10, 10);

	}

	else {
		// add your standing front facing code
		fill(255, 224, 189); // head 
		ellipse(gameChar_x, gameChar_y - 50, 25, 25);

		fill(255, 0, 0); // body (t-shirt)
		rect(gameChar_x - 10, gameChar_y - 40, 20, 23);

		fill(255, 224, 189);// the right leg 
		rect(gameChar_x, gameChar_y - 17, 8, 15);
		fill(0);
		rect(gameChar_x, gameChar_y - 17, 8, 10);

		fill(255, 224, 189);// the left leg 
		rect(gameChar_x - 10, gameChar_y - 17, 8, 15);
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 17, 8, 10);

		fill(0); // shose 
		rect(gameChar_x - 2, gameChar_y - 8, 10, 8);
		rect(gameChar_x - 15, gameChar_y - 8, 10, 8);

		fill(255, 224, 189);// right  hand 
		rect(gameChar_x + 10, gameChar_y - 40, 5, 25);

		fill(255, 224, 189); // left hand 
		rect(gameChar_x - 15, gameChar_y - 40, 5, 25);

		fill(255); // eye
		ellipse(gameChar_x + 5, gameChar_y - 53, 8);
		ellipse(gameChar_x - 5, gameChar_y - 53, 8)

		fill(0);
		ellipse(gameChar_x + 5, gameChar_y - 53, 3);
		ellipse(gameChar_x - 5, gameChar_y - 53, 3);

		fill(255);
		arc(gameChar_x, gameChar_y - 47, 15, 10, 0, PI);

		fill(60, 40, 20);
		arc(gameChar_x, gameChar_y - 60, 20, 15, PI, TWO_PI);
		ellipse(gameChar_x, gameChar_y - 60, 27, 8);
		ellipse(gameChar_x, gameChar_y - 65, 10, 10);

	}

}

function drawUserInterface()
{
	// lives token
	let hearts = "";
    for (let i = 0; i < lives; i++) 
	{
		hearts += "❤️";  //  one heart per life
    }   
    fill(0);
	strokeWeight(2);
	textSize(30);
	text("Lives:"+ hearts , cameraPosX + 40, 40);

// score 
	fill(0);
	noStroke();
	textSize(30)
	text("Score : " + game_score,cameraPosX+ 260, 40);

// make a timer ,every 60 frame is one second
	if(frameCount % 60 == 0 && timer> 0 && gameState==1 && lives>0)
	{
		timer-=1; 
		if(timer ===5  && !flagpole.isReached )
		{
			warning.play()
			
		}
		
	}
    // stop the warning sound and background music if flagPole is reached or the game is over 
	if(flagpole.isReached ||lives<1)
			{
				warning.stop();
				bgMusic.stop();
			}
	// write the timer on the screen 
	if(timer > 5)
	{
	fill(0);//black
	text("timer : " + timer, cameraPosX +410,40);
	} 
	else if(timer<=5)
	{

	fill(255,0,0);//red 
	text("timer : " + timer, cameraPosX +410,40);
	}

}

function GameInteraction()
{
	// if the character is not falling into a canyon, allow movement left and right
if(!isPlummeting)
{
	if (isLeft == true) 
	   {
		    gameChar_x -= 5;
	   }
	 if (isRight == true)
		{
		    gameChar_x += 5;
	    }
}
// check for platform contact when jamping or falling
	if (gameChar_y < floorPos_y)
 {
		var isContact= false;
        // check for collision 
       for(var i = 0;i < platforms.length;i++ )
	   {
		 if(platforms[i].checkContact(gameChar_x,gameChar_y)== true)
	       {
		         isContact = true;
		         break;
	        }
		}
		// apply gravity
		if(isContact ==false)
		{
		   gameChar_y += 2;
		   isFalling = true;
		}
	}
	else {
		isFalling = false;// when the character is on the ground 
	}
    // check if character falls into any canyon
    for (let i = 0; i < canyons.length; i++)
 {
	if (
		gameChar_x > canyons[i].x_pos &&
		gameChar_x < canyons[i].x_pos + canyons[i].width &&
		gameChar_y === floorPos_y) 
		{
		isPlummeting = true;
		isLeft = false;
		isRight = false;
		falling.play();
	}
}

	//  make the character fall down if plummeting
	if (isPlummeting == true)
	{
		gameChar_y += 3;
	}
}

function checkCollectable(t_collectable)
{
 if (!t_collectable.isFound && dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size  ) {
		
	    t_collectable.isFound = true;
		game_score += 1;
		coinSound.play();


 }
	if (t_collectable.isFound == false) {

		// drawing the collectable item

		fill(255,215,0) // gold color
		ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size )
		// add coin details 
		fill(218, 165,35);// darker gold 
		ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size*0.8)
        fill(255,223,0) 
		ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size*0.6);
		// dollar sign 
		
		fill(218, 165,35);// darker gold 
		textSize(30);
		text("$", t_collectable.x_pos-8, t_collectable.y_pos+9);
		


}
}

function checkCanyon(t_canyon)
{
    fill(100, 135, 255);
	rect(t_canyon.x_pos, 432, t_canyon.width, 200);
	
}

function  renderFlagpole()
{
	push();
    strokeWeight(5);
	stroke(180);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);

	fill(255, 0, 0);
	noStroke();

	if(flagpole.isReached)
	{
	rect(flagpole.x_pos,floorPos_y-250,50,50);	
	
	
	}
	else
	{
    rect(flagpole.x_pos,floorPos_y-50,50,50);
	}
    
	
	pop();
}

function checkFlagpole()
{
	var d = abs(gameChar_x - flagpole.x_pos);

	if(d< 15)
	{
		flagpole.isReached = true;
		winning.play();
	}
	
}

function checkEnemies()
{
	
    for(var i = 0;i < enemies.length;i++)
	{
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
	
	     if(isContact)
		 {
			if(lives > 0 )
			{
				startGame();
				break;
			}
		 }
	}

}

function checkPlayerDie()
{
   if(gameChar_y >height)
   {
     lives -=1 ; 

	 if (lives > 0 )
        {
            // reset player's position 
            gameChar_x = width / 2;
            gameChar_y = floorPos_y;
            isPlummeting = false;
        }
		
   }
   if(lives == 0 ||timer ==0 )
   {

	startGame();
   }

}

function showGameOverScreen()
{
	 
		if (!gameOver.isPlaying()) 
		{
        gameOver.play();
		}
        // create a blinking red and black background 
		if (frameCount % 10 <= 5) 
		{
          background(255,0,0,120); // red
        }
        else 
		{
         background(0,0,0,100); // black
        }
		// write "Game over" on the screen
		strokeWeight(10);
		stroke(0);
		textSize(100);
		fill(255,0,0);
		text("Game Over",cameraPosX + 240, height/2);
}

function showWinSreen()
{
	    background(0,0,0,80);
		strokeWeight(10);
		stroke(0);
		textSize(100);
		textAlign(CENTER)
		fill(255, 215, 0);
		text("🎉Level complete🎉",flagpole.x_pos, height/2 - 120);
		text("your score is:" + game_score ,flagpole.x_pos, height/2 +20);
	    bgMusic.display();
}

function startGame()
{
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	collectables =[ 
		{ x_pos: 230, y_pos: floorPos_y, size: 50, isFound: false },
        {x_pos: 430, y_pos: floorPos_y , size: 50, isFound: false },
		{x_pos: 70, y_pos: floorPos_y-125, size: 50, isFound: false }, 
		{x_pos: 850, y_pos: floorPos_y, size: 50, isFound: false },
        {x_pos: 1325, y_pos: floorPos_y-125 , size: 50, isFound: false },
	]
	canyons = [
		{ x_pos: 100, width: 100 },
        { x_pos: 540, width: 60 },
		{ x_pos: 940, width: 80 },
		{ x_pos: 1190, width: 110 }
	]
	trees_x = [300, 500, 900, 1150]
	treePos_y = height / 2 - 75;

	
	clouds = [
		{ x_pos: 200, y_pos: 400, size: 80 },
		{ x_pos: 400, y_pos: 400, size: 60 },
		{ x_pos: 750, y_pos: 400, size: 60 },
		{ x_pos: 950, y_pos: 400, size: 60 },
		{ x_pos: 0, y_pos: 400, size: 60 }
	]
	mountains = [
		{ x_pos: 700, y_pos: 300 },
		{ x_pos: 300, y_pos: 300 },
		{ x_pos: 1000, y_pos: 300 }
	]; 
	birds = [
		{x_pos:300, y_pos: 300},
		{x_pos:600, y_pos: 320},
		{x_pos:650, y_pos: 300}
	]
	cameraPosX = 0;

	game_score = 0;
	
	flagpole = {isReached:false , x_pos: 1500};

}

function createPlatforms(x, y, length)
{
	 var p = {
		       x: x,
			   y: y,
			   length:length,
			   draw: function(){
                //    fill(255,0,255);
				fill(139,69,19); 

				   rect(this.x, this.y, this.length,20);

				   
			   },
			   checkContact: function(gameChar_x,gameChar_y)
			   {
				if(gameChar_x > this.x && gameChar_x<this.x + this.length  )
			    {
					var d= this.y- gameChar_y;
                    if(d>= 0 && d<5 )
					{
						return true;
					}
					return false;
				}
				}
	 }
	 return p;
}

function Enemy(x, y, range)
{
	this.x= x;
	this.y= y;
	this.range= range ;
	this.currentX= x ;
	this.inc= 1;

	this.update= function()
	{
		 this.currentX += this.inc
		if( this.currentX >= this.x + this.range)
		{
			this.inc = -1 ;
		}
		else if (this.currentX < this.x)
		{
			this.inc =1;
		}
	}
	this.draw = function()
	{
		this.update();
		fill(255,0,0);
		
		// Enemy body   
		noStroke();

      // Head
      fill(200, 0, 0);
      ellipse(this.currentX, this.y - 50, 30);

      // / Body (t-shirt)
      fill(0);
      rect(this.currentX - 10, this.y - 40, 20, 23);

       // Right leg
      fill(200, 0, 0);
      rect(this.currentX, this.y - 17, 8, 15);
      fill(0);
      rect(this.currentX, this.y - 17, 8, 10);

      // Left leg
      fill(200, 0, 0);
      rect(this.currentX - 10, this.y - 17, 8, 15);
      fill(0);
      rect(this.currentX - 10, this.y - 17, 8, 10);

      // Right hand
      fill(200, 0, 0);
      rect(this.currentX + 10, this.y - 40, 25, 5);

       // Weapon (trident)
      stroke(0);
      strokeWeight(3);
      line(this.currentX + 30, this.y, this.currentX + 30, this.y-60 );
      line(this.currentX + 20, this.y - 60, this.currentX + 40, this.y - 60); // horizontal bar
      line(this.currentX + 20, this.y - 60, this.currentX + 20, this.y - 80); // left 
      line(this.currentX + 30, this.y - 60, this.currentX + 30, this.y - 85); // middle
      line(this.currentX + 40, this.y - 60, this.currentX + 40, this.y - 80); // right 

     // Left hand
      noStroke();
      fill(200, 0, 0);
      rect(this.currentX - 15, this.y - 40, 5, 25);

     // Eyes
      stroke(0);
      strokeWeight(1);
      fill(255);
      ellipse(this.currentX + 5, this.y - 53, 8,6);
      ellipse(this.currentX - 5, this.y - 53, 8,6);
  
      fill(200, 200, 0);
      ellipse(this.currentX + 5, this.y - 53, 3);
      ellipse(this.currentX - 5, this.y - 53, 3);
  
      // Angry eyelids
      stroke(0);
      strokeWeight(2);
      line(this.currentX - 9, this.y - 56, this.currentX - 1, this.y - 54); 
      line(this.currentX + 9, this.y - 56, this.currentX + 1, this.y - 54); 

      // Mouth + tooth
      noStroke();
      fill(0);
      arc(this.currentX, this.y - 47, 15, 10, 0, PI);
      fill(255);
      // middel tooth
      triangle(this.currentX+2, this.y - 47,
               this.currentX - 2, this.y - 47,
               this.currentX, this.y - 42);
      // Right tooth
      triangle(this.currentX - 6, this.y - 47, 
               this.currentX - 3, this.y - 47, 
               this.currentX - 5, this.y - 42);
      // Left  tooth
      triangle(this.currentX + 3, this.y - 47, 
               this.currentX + 6, this.y - 47, 
               this.currentX + 5, this.y - 42);
  
       // Horns (curved using arc)
       stroke(0);
       strokeWeight(3);
       noFill();

      //left horn
       arc(this.currentX -10, this.y - 75, 15, 30, HALF_PI, PI);
     // Right horn 
       arc(this.currentX + 10, this.y - 75, 15, 30, 0, HALF_PI);
       
	  
	}

	
	this.checkContact= function(gameChar_x, gameChar_y)
	{
       var d= dist(gameChar_x,gameChar_y, this.currentX,this.y)
	  if (d< 20 )
	  {
		lives-=1;
		return true;
		
	  }
	  return false;
	} } 
