let myVideo;
let threshSlider;
let prevPixels = [];


function setup() {
  createCanvas(640, 480);

  myVideo= createCapture(VIDEO);
  myVideo.size(width, height);
  myVideo.hide();

  threshSlider= createSlider(0,255,100);

}

function draw() {
  background(220);

  const threshValue = threshSlider.value();
  const currentPixels = myVideo.pixels;

  for( let y = 0; y= height; y++){
    for(let x = 0; x = width; x++){
      const i = (y*width+x)*4;

      const diffR = abs(currentPixels[i+0] - prevPixels[i+0]);
      const diffG = abs(currentPixels[i+1] - prevPixels[i+1]);
      const diffB = abs(currentPixels[i+2] - prevPixels[i+2]);

      const avgDiff = (diffR+diffG+diffB)/3;

      if(avgDiff<threshValue){
        currentPixels[i+0] = 0
        currentPixels[i+1] = 0
        currentPixels[i+2] = 0

      }

    }
  }

  myVideo.updatePixels();


  myVideo.loadPixels();

  push();
  translate(width, 0);
  scale(-1,1);
  image(myVideo, 0, 0, width, height);
  pop();
}
