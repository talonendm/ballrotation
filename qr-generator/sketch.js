let qr;
let cellSize = 8;
let input, button;
let currentUrl = "https://talonendm.github.io/"; // default URL

function setup() {
  createCanvas(400, 400);
  noLoop();

  // Create input and button
  input = createInput(currentUrl);
  input.position(10, height + 10);
  input.size(250);

  button = createButton('Generate QR');
  button.position(input.x + input.width + 10, height + 10);
  button.mousePressed(updateQR);

  // Generate first QR
  generateQR(currentUrl);
}

function draw() {
  background(255);

  if (!qr) return;

  let qrSize = qr.getModuleCount();

  // Center QR code
  let offsetX = (width - qrSize * cellSize) / 2;
  let offsetY = (height - qrSize * cellSize) / 2;

  // Draw QR
  for (let row = 0; row < qrSize; row++) {
    for (let col = 0; col < qrSize; col++) {
      if (qr.isDark(row, col)) {
        fill(0);
      } else {
        fill(255);
      }
      noStroke();
      rect(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize);
    }
  }
}

function generateQR(url) {
  qr = qrcode(0, 'M'); 
  qr.addData(url);
  qr.make();
  redraw();
}

function updateQR() {
  currentUrl = input.value();
  generateQR(currentUrl);
}
