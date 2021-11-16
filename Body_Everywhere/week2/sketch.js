let video;
let poseNet;
let flowerImage;
let flowerPixels;
let nosebrush;
let gotPose = false; 
let nX, nY, nZ;

function preload() {
  flowerImage = loadImage('guccifloral2a.jpg');
}

function setup() {
  pixelDensity(1);

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotPoses);

  nosebrush = new NoseBrush();
}

function draw() {

  flowerImage.loadPixels(); //
  // loadPixels();
  
  for (let i = 0; i < nosebrush.points.length; i++) { 
    const x = nosebrush.points[i].x;
    const y = nosebrush.points[i].y;
    const z = nosebrush.points[i].z;

    if (x === null) { 
      console.log('returning, point not defined');
      return;
    }

    const index = (y*width+x)*4;

    // noStroke();
    const r = flowerImage.pixels[index+0]; 
    const g = flowerImage.pixels[index+1];
    const b = flowerImage.pixels[index+2];
    const c = color(r,g,b);
    set(x,y,z,c);
  }
  updatePixels();

}

function gotPoses(poses) {
  if (poses.length > 0) {
    nX = Math.floor(poses[0].pose.keypoints[0].position.x);
    nY = Math.floor(poses[0].pose.keypoints[0].position.y);
    nZ = Math.floor(poses[0].pose.keypoints[0].position.z);

    nosebrush.update(nX, nY, nZ);
    if (!gotPose) gotPose=true;

  }
}


class NoseBrush {
  constructor() {
    this.points = [];
    this.width = 30; 
    this.d = 20;

    for (let y = 0; y < this.width; y++ ) { 
      for (let x = 0; x < this.width; x++) {
        for (let z = 0; x < this.d; z++){
          const newPoint = { x: null, y: null, z:null};
        this.points.push(newPoint);
        }
        
      }
    }
  }

  update(iX,iY,iZ) { 

    let i = 0;

    for (let y = 0; y < this.width; y++ ) { 
      for (let x = 0; x < this.width; x++) {
        for (let z = 0; x < this.d; z++){
          const tempX = iX + x;
          const tempY = iY + y;
          const tempZ = iZ + z;
    
          this.points[i].x = tempX;
          this.points[i].y = tempY;
          this.points[i].z = tempZ;
          i++;

        }
  
  }

  }


} 

}

