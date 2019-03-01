// Using this variable to decide whether to draw all the stuff
let debug = false;

// flowField object
let flowField;

// An ArrayList of vehicles
const vehicles = [];
const vehicleAmount = 120;
let vehicleSize = 2;
let vehicleCohesive = 10;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Make a new flowField with "resolution" of 40
  flowField = new FlowField((width / height) * 20);
  flowField.init();

  document.getElementById('size').addEventListener('change', (event) => {
    vehicleSize = parseInt(event.target.value, 10);
  });
  
  document.getElementById('cohesive').addEventListener('change', (event) => {
    vehicleCohesive = parseInt(event.target.value, 10);
  });

  // Make a whole bunch of vehicles with random maxSpeed and maxForce values
  Array.from(Array(vehicleAmount)).map(() => {
    vehicles.push(new Vehicle(random(width), random(height), random(2, 5), random(0.1, 0.5)));
  });
}

function draw() {
  background(51);
  // Display the flowField in "debug" mode
  if (debug) flowField.display();

  // Tell all the vehicles to follow the flow field
  vehicles.map((vehicle) => {
    vehicle
    .follow(flowField)
    .separate(vehicles)
    .draw();
    vehicle.size = vehicleSize;
    vehicle.cohesive = vehicleCohesive;
  });
}

function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
}

// Make a new flowField
function mousePressed() {
  flowField.init();
}

/* function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY, random(2, 5), random(0.1, 0.5)));
} */