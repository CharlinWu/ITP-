let range = 80;
let gap = 10.5;
let cubeSize = 20;
let cubeThickness = 20;
let video, poseNet;
let poses = [];
let noseX, noseY;

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
  createCanvas(640, 480, WEBGL);
    //Set up video capture
    video = createCapture(VIDEO);
    video.hide();

  //createCanvas(640, 480, WEBGL);
  angleMode(DEGREES);
  smooth();
  ambientMaterial(255);
  noStroke();
  colorMode(HSB);
  

  //video.size(width, height);
  
  //Set up poseNet
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', function(results) {
    poses = results;
    noseX = width - (poses[0].pose.nose.x);
    noseY = poses[0].pose.nose.y;
  });
  
  noseX = width/2;
  noseY = height/2;
}

function draw() {
  background(255);
  const threshValue = threshSlider.value();
  video.loadPixels();
  const currentPixels = video.pixels;

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
  video.updatePixels();
  
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 200, width, height);
  // image(video, 0, 0, width, height);
  pop();
  
  //Create the lighting
  let locX = noseX - width / 2;
  let locY = noseY - height / 2;
  let hue1 = map(noseX, width*0.25, width*0.75, 220, 360);
  let hue2 = map(noseY, height*0.25, height*0.75, 220, 360);
  pointLight(hue1, 100, 100, -width/2, 0, 250);
  pointLight(hue2, 100, 100, width/2, 0, 250);
  pointLight(0, 0, 100, locX, locY, 0);
  
  //Draw the cubes
  translate(-width/2 + cubeSize, -height/2 + cubeSize);
  let xNum = floor(width/(cubeSize+gap));
  let yNum = floor(height/(cubeSize+gap));
  for (let i = 0; i < xNum; i++) {
    for (let j = 0; j < yNum; j++) {
      push();
      let rX = map(noseY, 0, height, range, -range);
      let rY = map(noseX, 0, width, -range, range);
      rotateX(rX);
      rotateY(rY);
      box(cubeSize, cubeSize, cubeThickness);
      pop();
      if (j+1 == xNum) {
        translate(-(cubeSize+gap)*j, cubeSize+gap);
      }
      else
        translate(cubeSize+gap, 0);
    }
  }


}

function setBG() {
  console.log("setting bg!!");

  // see above documentation on loadPixels
  video.loadPixels();
  // see documentation above on spread operator
  bgPixels = [...video.pixels];
}
  
