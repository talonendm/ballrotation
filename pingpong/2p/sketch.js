let paddleW = 20;
let paddleH = 80;
let ballSize = 14;

// Paddle positions
let leftY, rightY;
let leftX, rightX;

// Ball
let ballX, ballY, ballVX, ballVY;

// Scores
let leftScore = 0;
let rightScore = 0;
let pointsToWin = 100;

// Ball speed
let speedMultiplier = 1.0;
const SPEED_INCREASE = 1.05;
const MAX_SPEED = 14;

let playerSpeed = 8;

const HIT_H = paddleH * 0.5*2;
const HIT_W = paddleW * 1.8; // verkon leveys

const HIT_OFFSET = -paddleH * 0.5; // sama kuin kuvan offset



// Game timing
let gameStartTime = 0;
let longestGame = 0;

let leftAngle = 0;
let leftTargetAngle = 0;


const HIT_ANGLE = Math.PI / 5;   // kuinka voimakas lyönti
const ANGLE_LERP = 0.25;         // animaation nopeus (0.1–0.3 hyvä)


let rightAngle = 0;
let rightTargetAngle = 0;

const ANGLE_ANIM_SPEED = 0.15; // nopeampi = lyöntimäisempi


const ANGLE_SPEED = 0.04;
const MAX_ANGLE = Math.PI / 8; // 45 / 2

let useImages = true; // toggle this on/off
let paddleImgLeft, paddleImgRight;

let leftFlipped = false;
let rightFlipped = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);

  leftX = paddleW / 2 + 20;
  rightX = width - paddleW / 2 - 20;

  startGame();
}


function preload() {
  if (useImages) {
    paddleImgLeft = loadImage('leftPaddle2.png');  // path to your left paddle PNG
    paddleImgRight = loadImage('rightPaddle2.png'); // path to your right paddle PNG
  }
}



function startGame() {
  leftScore = 0;
  rightScore = 0;
  speedMultiplier = 1.0;

  leftY = height / 2;
  rightY = height / 2;

  resetBall();

  gameStartTime = millis(); // aloita ajastin
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 2;

  let angle = random(-PI / 6, PI / 6);
  let dir = random([1, -1]);
  ballVX = dir * 5 * cos(angle);
  ballVY = 5 * sin(angle);

  speedMultiplier = 1.0;
}


function startRallyTimer() {
  gameStartTime = millis();
}

function scorePoint(isLeftPlayerScored) {
  let rallyTime = millis() - gameStartTime;

  if (rallyTime > longestGame) {
    longestGame = rallyTime;
  }

  if (isLeftPlayerScored) leftScore++;
  else rightScore++;

  resetBall();
  startRallyTimer();
}




function getHitY(isLeft) {
  let baseY = isLeft ? leftY : rightY;
  let flipped = isLeft ? leftFlipped : rightFlipped;
  return baseY + (flipped ? -HIT_OFFSET+HIT_OFFSET : HIT_OFFSET+HIT_OFFSET);
}



function draw() {
  background("green");

  // Net
  stroke(200);
  drawingContext.setLineDash([5, 5]);
  line(width / 2, 0, width / 2, height);
  drawingContext.setLineDash([]);

  // Paddles
  noStroke();
  fill("beige");

  push();
  translate(leftX, leftY);
  rotate(leftAngle + (leftFlipped ? PI : 0));

  if (useImages && paddleImgLeft) {
    imageMode(CENTER);
    image(
      paddleImgLeft,
      0,
      leftFlipped ? -HIT_OFFSET : HIT_OFFSET,
      paddleW * 2,
      paddleH * 2
    );
  } else {
    rect(0, 0, paddleW, paddleH);
  }
  pop();


  push();
  translate(rightX, rightY);
  rotate(rightAngle + (rightFlipped ? PI : 0));

  if (useImages && paddleImgRight) {
    imageMode(CENTER);
    image(
      paddleImgRight,
      0,
      rightFlipped ? -HIT_OFFSET : HIT_OFFSET,
      paddleW * 2,
      paddleH * 2
    );
  } else {
    rect(0, 0, paddleW, paddleH);
  }
  pop();




// DEBUG: osuma-alueet
noFill();
stroke(255, 0, 0);

rect(
  leftX,
  getHitY(true),
  HIT_W,
  HIT_H
);

rect(
  rightX,
  getHitY(false),
  HIT_W,
  HIT_H
);

noStroke();




  // Ball
  fill("white");
  ellipse(ballX, ballY, ballSize, ballSize);

  handleInput();
  moveBall();
  drawScore();
  drawTime();
  checkWin();
}


function keyPressed() {
  // LEFT PLAYER flip
  if (key === 'G' || key === 'g') {
    leftFlipped = !leftFlipped;
  }

  // RIGHT PLAYER flip
  if (key === 'L' || key === 'l') {
    rightFlipped = !rightFlipped;
  }
}



// Piirtää pelin keston ja pisimmän pelin
function drawTime() {
  fill(255);
  textSize(18);
  textAlign(CENTER);

  let current =
    Math.round(((millis() - gameStartTime) / 1000) * 100) / 100;

  let longest =
    Math.round((longestGame / 1000) * 100) / 100;

  text(
    ` ${current} s`,
    width / 2,
    25
  );

  text(
    `Pisin bole: ${longest} s`,
    width / 2,
    55
  );


}


function handleInput() {
  if (keyIsDown(87)) leftY -= playerSpeed; // W
  if (keyIsDown(83)) leftY += playerSpeed; // S
  if (keyIsDown(65)) leftX -= playerSpeed; // W
  if (keyIsDown(68)) leftX += playerSpeed; // S
  if (keyIsDown(UP_ARROW)) rightY -= playerSpeed;
  if (keyIsDown(DOWN_ARROW)) rightY += playerSpeed;
  if (keyIsDown(LEFT_ARROW)) rightX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) rightX += playerSpeed;

  if (keyIsDown(81)) leftAngle -= ANGLE_SPEED; // Q
  if (keyIsDown(69)) leftAngle += ANGLE_SPEED; // E

  if (keyIsDown(56)) rightY -= playerSpeed;
  if (keyIsDown(50)) rightY += playerSpeed;
  if (keyIsDown(52)) rightX -= playerSpeed;
  if (keyIsDown(54)) rightX += playerSpeed;

  //if (keyIsDown(55)) rightAngle -= ANGLE_SPEED; // Q
  //if (keyIsDown(57)) rightAngle += ANGLE_SPEED; // E

  // Right paddle rotation
  // if (keyIsDown(85)) rightAngle -= ANGLE_SPEED; // U
  // if (keyIsDown(79)) rightAngle += ANGLE_SPEED; // O

  // Right paddle rotation
  if (keyIsDown(79)) rightAngle -= ANGLE_SPEED; // O key → rotate CCW
  if (keyIsDown(80)) rightAngle += ANGLE_SPEED; // P key → rotate CW



  // LEFT PLAYER
  if (keyIsDown(70)) { // O = perus
    leftTargetAngle = MAX_ANGLE;
  }

  if (keyIsDown(82)) { // P = rysty
    leftTargetAngle = -MAX_ANGLE;
  }

  // RIGHT PLAYER
  if (keyIsDown(73)) { // I = perus
    rightTargetAngle = -MAX_ANGLE;
  }

  if (keyIsDown(75)) { // K = rysty
    rightTargetAngle = MAX_ANGLE;
  }

  if (
    !keyIsDown(70) &&
    !keyIsDown(82)
  ) {
    leftTargetAngle = 0;
  }

  if (
    !keyIsDown(73) &&
    !keyIsDown(75)
  ) {
    rightTargetAngle = 0;
  }



  // Animoidaan kulma kohti tavoitetta
  leftAngle = lerp(leftAngle, leftTargetAngle, ANGLE_LERP);

  // Kun lyönti on melkein valmis → palauta maila keskelle
  if (abs(leftAngle - leftTargetAngle) < 0.01) {
    leftTargetAngle = 0;
  }




  leftAngle = constrain(leftAngle, -MAX_ANGLE, MAX_ANGLE);
  rightAngle = constrain(rightAngle, -MAX_ANGLE, MAX_ANGLE);

  for (let t of touches) {
    if (t.x < width / 2) leftY = t.y;
    else rightY = t.y;
  }

  leftY = constrain(leftY, paddleH / 2, height - paddleH / 2);
  rightY = constrain(rightY, paddleH / 2, height - paddleH / 2);

  const MID = width / 2;

  leftX = constrain(
    leftX,
    paddleW / 2,
    MID - paddleW / 2
  );

  rightX = constrain(
    rightX,
    MID + paddleW / 2,
    width - paddleW / 2
  );


}





function moveBall() {
  ballX += ballVX * speedMultiplier;
  ballY += ballVY * speedMultiplier;

  if (ballY - ballSize / 2 < 0) {
    ballY = ballSize / 2;
    ballVY = abs(ballVY);
  }

  if (ballY + ballSize / 2 > height) {
    ballY = height - ballSize / 2;
    ballVY = -abs(ballVY);
  }


  let hitY = getHitY(true);

  if (
    ballX - ballSize / 2 < leftX + paddleW / 2 &&
    ballX - ballSize / 2 > leftX - paddleW / 2 &&
    ballY > hitY - HIT_H / 2 &&
    ballY < hitY + HIT_H / 2
  ) {
    applySpin(hitY, true);
  }


hitY = getHitY(false);

if (
  ballX + ballSize / 2 > rightX - HIT_W / 2 &&
  ballX - ballSize / 2 < rightX + HIT_W / 2 &&
  ballY + ballSize / 2 > hitY - HIT_H / 2 &&
  ballY - ballSize / 2 < hitY + HIT_H / 2
) {
  applySpin(hitY, false);
}


  if (ballX < 0) {
    scorePoint(false);
  }

  if (ballX > width) {
    scorePoint(true);
  }

}




function applySpin(hitY, isLeftPlayer) {
  let hitPos = (ballY - hitY) / (paddleH / 2);
  hitPos = constrain(hitPos, -1, 1);

  let angle = hitPos * PI / 3;
  let speed = min(sqrt(ballVX ** 2 + ballVY ** 2) * SPEED_INCREASE, MAX_SPEED);

  let direction = isLeftPlayer ? 1 : -1;
  ballVX = direction * speed * cos(angle);
  ballVY = speed * sin(angle);

  speedMultiplier = min(speedMultiplier * SPEED_INCREASE, MAX_SPEED / 5);
}


function applySpinBAK(hitY, isLeftPlayer) {
  let hitPos = (ballY - hitY) / (HIT_H / 2);
  hitPos = constrain(hitPos, -1, 1);

  let baseAngle = hitPos * PI / 3;

  let paddleAngle = isLeftPlayer
    ? leftAngle + (leftFlipped ? PI : 0)
    : rightAngle + (rightFlipped ? PI : 0);

  let finalAngle = baseAngle + paddleAngle * 0.8;

  // 🔥 PEILAUS OIKEALLE PELAAJALLE
  if (!isLeftPlayer) {
    finalAngle = PI - finalAngle;
  }


  finalAngle = PI - finalAngle;

  let speed = min(
    sqrt(ballVX ** 2 + ballVY ** 2) * SPEED_INCREASE,
    MAX_SPEED
  );

  ballVX = speed * cos(finalAngle);
  ballVY = speed * sin(finalAngle);
}



function drawScore() {
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text(`Left: ${leftScore} | Right: ${rightScore}`, width / 2, height - 25);
}

function checkWin() {
  if (leftScore >= pointsToWin || rightScore >= pointsToWin) {
    noLoop();

    let thisGame = millis() - gameStartTime;

    if (thisGame > longestGame) {
      longestGame = thisGame;
    }

    setTimeout(() => {
      alert(leftScore > rightScore ? "Left player wins! 🎉" : "Right player wins! 🎉");
      loop();
      startGame();
    }, 100);
  }
}

// Fullscreen
function touchStarted() { if (!fullscreen()) fullscreen(true); return false; }
function mousePressed() { if (!fullscreen()) fullscreen(true); }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  leftX = paddleW / 2 + 20;
  rightX = width - paddleW / 2 - 20;
  leftY = height / 2;
  rightY = height / 2;
  resetBall();
}

document.ontouchmove = function (event) { event.preventDefault(); };
