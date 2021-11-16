let video;
let poseNet;
let flowerImage;
let flowerPixels;
let gotPose = false; 
let nX, nY;

function preload() {
  flowerImage = loadImage('guccifloral2.jpg');
}

function setup() {
  pixelDensity(1);

  flowerImage.loadPixels();
  flowerPixels = [...flowerImage.pixels];
  
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotPoses);

}

function draw() {
  if (gotPose) { 
      image(flowerImage, nX,nY,20,20, nX,nY, 20,20);
  }
}

function gotPoses(poses) {
  if (poses.length > 0) {
    nX = poses[0].pose.keypoints[0].position.x;
    nY = poses[0].pose.keypoints[0].position.y;

    if (!gotPose) gotPose=true;   
  }
}

