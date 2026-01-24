let paddleW = 12;
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

// Game timing
let gameStartTime = 0;
let longestGame = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);

  leftX = paddleW / 2 + 20;
  rightX = width - paddleW / 2 - 20;

  startGame();
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
  rect(leftX, leftY, paddleW, paddleH);
  rect(rightX, rightY, paddleW, paddleH);

  // Ball
  fill("white");
  ellipse(ballX, ballY, ballSize, ballSize);

  handleInput();
  moveBall();
  drawScore();
  drawTime();
  checkWin();
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
  if (keyIsDown(87)) leftY -= 6; // W
  if (keyIsDown(83)) leftY += 6; // S
  if (keyIsDown(UP_ARROW)) rightY -= 6;
  if (keyIsDown(DOWN_ARROW)) rightY += 6;

  for (let t of touches) {
    if (t.x < width / 2) leftY = t.y;
    else rightY = t.y;
  }

  leftY = constrain(leftY, paddleH / 2, height - paddleH / 2);
  rightY = constrain(rightY, paddleH / 2, height - paddleH / 2);
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

  if (
    ballX - ballSize / 2 < leftX + paddleW / 2 &&
    ballY > leftY - paddleH / 2 && ballY < leftY + paddleH / 2
  ) {
    applySpin(leftY, true);
  }

  if (
    ballX + ballSize / 2 > rightX - paddleW / 2 &&
    ballY > rightY - paddleH / 2 && ballY < rightY + paddleH / 2
  ) {
    applySpin(rightY, false);
  }

  if (ballX < 0) {
    scorePoint(false);
  }

  if (ballX > width) {
    scorePoint(true);
  }

}

function applySpin(paddleY, isLeftPlayer) {
  let hitPos = (ballY - paddleY) / (paddleH / 2);
  hitPos = constrain(hitPos, -1, 1);

  let angle = hitPos * PI / 3;
  let speed = min(sqrt(ballVX ** 2 + ballVY ** 2) * SPEED_INCREASE, MAX_SPEED);

  let direction = isLeftPlayer ? 1 : -1;
  ballVX = direction * speed * cos(angle);
  ballVY = speed * sin(angle);

  speedMultiplier = min(speedMultiplier * SPEED_INCREASE, MAX_SPEED / 5);
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
