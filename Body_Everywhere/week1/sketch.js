let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eye1X = 0, eye1Y = 0, eye2X = 0, eye2Y = 0;
let flowerImage;
let flowerPixels;
let bgPixels = [];
let threshSlider;

function preload() {
  flowerImage = loadImage('guccifloral2.jpg');
}

function setup() {

  flowerImage.loadPixels();
  flowerPixels = [...flowerImage.pixels];
  threshSlider = createSlider(0, 255, 100);
  const bgButton = createButton("Set BG");
  bgButton.mousePressed(setBG);

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotPoses);
}

function draw() {

  const threshValue = threshSlider.value();
  video.loadPixels();
  const currentPixels = video.pixels;

  let d = dist(noseX, noseY, eye1X, eye1Y);
  
  let distance = d*4/5;

  fill(255, 0, 0);
  ellipse(noseX, noseY, distance);
  
  eye(eye1X, eye1Y, distance, 1);
  eye(eye2X, eye2Y, distance, -1);

  
  for (let y1 = 0; y1 < height; y1++) {
    for (let x1 = 0; x1 < width; x1++) {
      const i = (y1 * width + x1) * 4;
      const diffR = abs(currentPixels[i + 0] - bgPixels[i + 0]);
      const diffG = abs(currentPixels[i + 1] - bgPixels[i + 1]);
      const diffB = abs(currentPixels[i + 2] - bgPixels[i + 2]);

      const avgDiff = (diffR + diffB + diffG) / 3;

      if (avgDiff < threshValue) {
        currentPixels[i + 0] = 0;
        currentPixels[i + 1] = 0;
        currentPixels[i + 2] = 0;
      } else {
        currentPixels[i + 0] = flowerPixels[i + 0];
        currentPixels[i + 1] = flowerPixels[i + 1];
        currentPixels[i + 2] = flowerPixels[i + 2];
      }
    }
  }

  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     const i = (y * width + x) * 4;
  //     const diffR = abs(currentPixels[i + 0] - bgPixels[i + 0]);
  //     const diffG = abs(currentPixels[i + 1] - bgPixels[i + 1]);
  //     const diffB = abs(currentPixels[i + 2] - bgPixels[i + 2]);

  //     const avgDiff = (diffR + diffB + diffG) / 3;

  //     if (avgDiff < threshValue) {
  //       currentPixels[i + 0] = 0;
  //       currentPixels[i + 1] = 0;
  //       currentPixels[i + 2] = 0;
  //     } else {
  //       currentPixels[i + 0] = flowerPixels[i + 0];
  //       currentPixels[i + 1] = flowerPixels[i + 1];
  //       currentPixels[i + 2] = flowerPixels[i + 2];
  //     }
  //   }
  // }



  video.updatePixels();
  
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 100, width, height);
  // image(video, 0, 0, width, height);
  pop();

  // let d = dist(noseX, noseY, eye1X, eye1Y);
  
  // let distance = d*4/5;

  // fill(255, 0, 0);
  // ellipse(noseX, noseY, distance);
  
  // eye(eye1X, eye1Y, distance, 1);
  // eye(eye2X, eye2Y, distance, -1);

  video.updatePixels();
  
  // push();
  // translate(width, 0);
  // scale(-1, 1);
  // image(video, 0, 0, width, height);
  // pop();

}

function setBG() {
  console.log("setting bg!!");

  // see above documentation on loadPixels
  video.loadPixels();
  // see documentation above on spread operator
  bgPixels = [...video.pixels];
}


function eye(x, y, size, n) {
	let angle = frameCount * 0.2;
	
	fill(255);
	noStroke();
	ellipse(x, y, size);
	
	fill(56);
	noStroke();
	ellipse(x+cos(angle*n)*size/5, y+sin(angle*n)*size/5, size/2);
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    noseX = lerp(noseX, nX, 0.75);
    noseY = lerp(noseY, nY, 0.75);
    
    let e1X = poses[0].pose.keypoints[1].position.x;
    let e1Y = poses[0].pose.keypoints[1].position.y;
    eye1X = lerp(eye1X, e1X, 0.75);
    eye1Y = lerp(eye1Y, e1Y, 0.75);
    
    let e2X = poses[0].pose.keypoints[2].position.x;
    let e2Y = poses[0].pose.keypoints[2].position.y;
    eye2X = lerp(eye2X, e2X, 0.75);
    eye2Y = lerp(eye2Y, e2Y, 0.75);
  }
  else {
    noseX = -10;
    noseY = -10;
    eye1X = -10;
    eye1Y = -10;
    eye2X = -10;
    eye2Y = -10;
  }
}




  
