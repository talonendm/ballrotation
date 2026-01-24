let paddleW = 12;
let paddleH = 80;
let ballSize = 14;

let leftY, rightY;
let ballX, ballY, ballVX, ballVY;

let leftScore = 0;
let rightScore = 0;

let pointsToWin = 5;

let speedMultiplier = 1.0;
const SPEED_INCREASE = 1.05;
const MAX_SPEED = 14;

function setup() {
  createCanvas(700, 400);
  startGame();
}

function startGame() {
  leftScore = 0;
  rightScore = 0;
  speedMultiplier = 1.0;

  leftY = height / 2 - paddleH / 2;
  rightY = leftY;

  resetBall();
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
  rect(5, leftY, paddleW, paddleH);
  rect(width - 17, rightY, paddleW, paddleH);

  // Ball
  fill("white");
  circle(ballX, ballY, ballSize);

  handleInput();
  moveBall();
  drawScore();
  checkWin();
}

function handleInput() {
  // Keyboard
  if (keyIsDown(87)) leftY -= 6; // W
  if (keyIsDown(83)) leftY += 6; // S
  if (keyIsDown(UP_ARROW)) rightY -= 6;
  if (keyIsDown(DOWN_ARROW)) rightY += 6;

  // Multi-touch support
  for (let t of touches) {
    if (t.x < width / 2) {
      leftY = t.y - paddleH / 2;
    } else {
      rightY = t.y - paddleH / 2;
    }
  }

  leftY = constrain(leftY, 0, height - paddleH);
  rightY = constrain(rightY, 0, height - paddleH);
}


function moveBall() {
  ballX += ballVX * speedMultiplier;
  ballY += ballVY * speedMultiplier;

  // Wall collision
  if (ballY < 0 || ballY > height) {
    ballVY *= -1;
  }

  // Left paddle collision
  if (
    ballX - ballSize / 2 < 17 &&
    ballY > leftY &&
    ballY < leftY + paddleH
  ) {
    applySpin(leftY, true);
  }

  // Right paddle collision
  if (
    ballX + ballSize / 2 > width - 17 &&
    ballY > rightY &&
    ballY < rightY + paddleH
  ) {
    applySpin(rightY, false);
  }

  // Scoring
  if (ballX < 0) {
    rightScore++;
    resetBall();
  }

  if (ballX > width) {
    leftScore++;
    resetBall();
  }
}

function applySpin(paddleY, isLeftPlayer) {
  let paddleCenter = paddleY + paddleH / 2;
  let hitPos = (ballY - paddleCenter) / (paddleH / 2);
  hitPos = constrain(hitPos, -1, 1);

  let angle = hitPos * PI / 3;
  let speed = min(
    sqrt(ballVX * ballVX + ballVY * ballVY) * SPEED_INCREASE,
    MAX_SPEED
  );

  let direction = isLeftPlayer ? 1 : -1;
  ballVX = direction * speed * cos(angle);
  ballVY = speed * sin(angle);

  speedMultiplier *= SPEED_INCREASE;
}

function drawScore() {
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text(
    `Left: ${leftScore}   |   Right: ${rightScore}`,
    width / 2,
    height - 15
  );
}

function checkWin() {
  if (leftScore >= pointsToWin || rightScore >= pointsToWin) {
    noLoop();
    setTimeout(() => {
      alert(leftScore > rightScore ? "Left player wins! 🎉" : "Right player wins! 🎉");
      loop();
      startGame();
    }, 100);
  }
}
