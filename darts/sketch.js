let video;
let poseNet;
let poses = [];
let wristTrail = [];

function setup() {
  createCanvas(640, 480);

  // capture video
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
}

function videoReady() {
  console.log("Video ready");

  // Initialize PoseNet AFTER video is ready
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function modelReady() {
  console.log("PoseNet ready!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawArmLines();
}

function drawArmLines() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    let shoulder = pose.rightShoulder;
    let elbow = pose.rightElbow;
    let wrist = pose.rightWrist;

    if (shoulder && elbow && wrist) {
      fill(255, 0, 0);
      noStroke();
      ellipse(shoulder.x, shoulder.y, 10);
      ellipse(elbow.x, elbow.y, 10);
      ellipse(wrist.x, wrist.y, 10);

      stroke(0, 255, 0);
      strokeWeight(4);
      line(shoulder.x, shoulder.y, elbow.x, elbow.y);
      line(elbow.x, elbow.y, wrist.x, wrist.y);

      wristTrail.push(createVector(wrist.x, wrist.y));
      if (wristTrail.length > 50) wristTrail.shift();

      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      beginShape();
      for (let v of wristTrail) vertex(v.x, v.y);
      endShape();

      let angle = calculateAngle(shoulder, elbow, wrist);
      fill(255);
      noStroke();
      textSize(16);
      text(`Elbow: ${angle.toFixed(1)}°`, 10, height - 10);
    }
  }
}

function calculateAngle(A, B, C) {
  let AB = createVector(A.x - B.x, A.y - B.y);
  let CB = createVector(C.x - B.x, C.y - B.y);
  let angle = degrees(AB.angleBetween(CB));
  return angle;
}
