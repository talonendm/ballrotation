let paddleW = 12;
let paddleH = 80;
let ballSize = 14;

let playerY, aiY;
let ballX, ballY, ballVX, ballVY;

let playerScore = 0;
let aiScore = 0;

let pointsToWin = 5;
let aiSpeed = 4;

let speedMultiplier = 1.0;
const SPEED_INCREASE = 1.05;
const MAX_SPEED = 14;

function setup() {
  createCanvas(700, 400);
  startGame();
}

function startGame() {
  playerScore = 0;
  aiScore = 0;
  speedMultiplier = 1.0;

  playerY = height / 2 - paddleH / 2;
  aiY = playerY;

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
  rect(5, playerY, paddleW, paddleH);
  rect(width - 17, aiY, paddleW, paddleH);

  // Ball
  fill("white");
  circle(ballX, ballY, ballSize);

  updateGame();
  drawScore();
}

function updateGame() {
  handleInput();
  moveAI();
  moveBall();
  checkWin();
}

function handleInput() {
  // Keyboard
  if (keyIsDown(UP_ARROW)) playerY -= 6;
  if (keyIsDown(DOWN_ARROW)) playerY += 6;

  // Touch / mouse
  if (mouseIsPressed) {
    playerY = mouseY - paddleH / 2;
  }

  playerY = constrain(playerY, 0, height - paddleH);
}

function moveAI() {
  let aiCenter = aiY + paddleH / 2;
  aiY += (ballY - aiCenter) * 0.08 * aiSpeed;
  aiY = constrain(aiY, 0, height - paddleH);
}

function moveBall() {
  ballX += ballVX * speedMultiplier;
  ballY += ballVY * speedMultiplier;

  // Wall collision
  if (ballY < 0 || ballY > height) {
    ballVY *= -1;
  }

  // Player paddle collision (with spin)
  if (
    ballX - ballSize / 2 < 17 &&
    ballY > playerY &&
    ballY < playerY + paddleH
  ) {
    applySpin(playerY, true);
  }

  // AI paddle collision (with spin)
  if (
    ballX + ballSize / 2 > width - 17 &&
    ballY > aiY &&
    ballY < aiY + paddleH
  ) {
    applySpin(aiY, false);
  }

  // Scoring
  if (ballX < 0) {
    aiScore++;
    resetBall();
  }

  if (ballX > width) {
    playerScore++;
    resetBall();
  }
}

function applySpin(paddleY, isPlayer) {
  // Relative hit position (-1 to 1)
  let paddleCenter = paddleY + paddleH / 2;
  let hitPos = (ballY - paddleCenter) / (paddleH / 2);

  hitPos = constrain(hitPos, -1, 1);

  let angle = hitPos * PI / 3; // max ~60 degrees
  let speed = min(
    sqrt(ballVX * ballVX + ballVY * ballVY) * SPEED_INCREASE,
    MAX_SPEED
  );

  let direction = isPlayer ? 1 : -1;
  ballVX = direction * speed * cos(angle);
  ballVY = speed * sin(angle);

  speedMultiplier *= SPEED_INCREASE;
}

function drawScore() {
  fill(255);
  textSize(18);
  textAlign(CENTER);
  text(
    `Player: ${playerScore}   |   Computer: ${aiScore}`,
    width / 2,
    height - 15
  );
}

function checkWin() {
  if (playerScore >= pointsToWin || aiScore >= pointsToWin) {
    noLoop();
    setTimeout(() => {
      alert(playerScore > aiScore ? "You win! 🎉" : "Computer wins 🤖");
      loop();
      startGame();
    }, 100);
  }
}
