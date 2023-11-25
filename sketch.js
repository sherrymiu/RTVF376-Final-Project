// ** Variables Section ** //
let planeImg;
let starImg;
let stars = [];
let paperPlane;
let isAnimating = false;
let planeToStar = false;
let opacity1 = 255; 
let opacity2 = 0; 
let transitioning = false;
let textOpacity;

function preload() {
  planeImg = loadImage('paperPlane.png');
  starImg = loadImage('star.png');
}

// ** Classes Section ** //
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.25, 3);
    this.t = random(TAU);
  }

  move() {
    this.t += 0.1;
    this.x += cos(this.t*0.1)*1;
    this.y += sin(this.t*0.1)*1;
    if (this.x<0||this.x>width||this.y<0||this.y>height){
      this.x = random(width);
      this.y = random(height);
      this.t = random(TAU);
    }
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.x,this.y,this.size);
  }
}

class PaperPlane {
  constructor() {
    // Start point of the plane
    this.startX = width + 100; 
    this.startY = height + 100;
    // Ends at the middle of the screen
    this.destX = width / 2;
    this.destY = height / 2;
    // Control variables
    this.t = 0; 
    this.speed = 0.008; 
    this.updatePosition();
  }

  hasLanded(){
    let centerX = width/2;
    let centerY = height/2;

    let distance = dist(this.x, this.y, centerX, centerY);
    let landingThreshold = 10;

    return distance < landingThreshold;
  }

  updatePosition(){
    this.x = width / 2;
    this.y = height / 2;
  }

  move(){
    this.t += this.speed;
    this.x = lerp(this.startX, this.destX, this.t);
    this.y = lerp(this.startY, this.destY, this.t) - (150 * sin(this.t * PI));

    if (this.t >= 1) {
      this.x = this.destX;
      this.y = this.destY;
    }
  }

  show(){
    push();
    translate(this.x, this.y);
    rotate(atan2(this.destY - this.y, this.destX - this.x));
    imageMode(CENTER);
    image(planeImg,0,0,30,30);
    pop();
  }
}

function startAnimation(){
  isAnimating = true;
  hideInput('dump-box');
}

function hideInput(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

function showInput(elementId) {
  let element = document.getElementById(elementId);
  if (element) {
    element.style.display = '';
  }
}

function transform() {
  if (transitioning) {
    if (opacity1 > 0) {
      opacity1 -= 20;
      opacity2 += 20;
    } else if (opacity2 > 0) {
      opacity2 -= 20;
    }

    opacity1 = constrain(opacity1, 0, 255);
    opacity2 = constrain(opacity2, 0, 255);

    if (opacity1 == 0 && opacity2 == 0) {
      transitioning = false;
      planeToStar = false;
      showInput('theEnd');
    }
  }

  tint(255, opacity1);
  image(planeImg, width / 2, height / 2, 30, 30);
  tint(255, opacity2);
  image(starImg, width / 2, height / 2, 30, 30);
}

function drawText() {
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Can we pretend that paper plane in the night sky a shooting star?", width / 2, height / 2);
}

function showRefreshButton() {
  document.getElementById('refreshButton').style.display = 'block';
}


// ** Text Input Section ** //
document.getElementById('textForm').addEventListener('submit', function(event) {
  event.preventDefault();
  document.getElementById('textInput').value = '';
  startAnimation();
});

document.getElementById('textForm2').addEventListener('submit', function(event) {
  event.preventDefault();
  document.getElementById('textInput').value = '';
  planeToStar = true;
});


// ** Execution Section ** //
function setup() {
  createCanvas(windowWidth, windowHeight).parent('canvas-container');
  document.getElementById('wish-box').style.display = 'none';
  document.getElementById('theEnd').style.display = 'none';
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
  paperPlane = new PaperPlane();
}


function draw() {
  background(0);
  for (let star of stars) {
    star.move();
    star.show();
  }

  if (isAnimating) {
    paperPlane.move();
    paperPlane.show();

    if (paperPlane.hasLanded()) {
      isAnimating = false;
      paperPlane.updatePosition();
      setTimeout(function() {
        showInput('wish-box');
      }, 1000);
    }
  }

  if (planeToStar) {
    hideInput('wish-box');
    transitioning = true;
    transform();
  } else {
    paperPlane.show();
  }
}
