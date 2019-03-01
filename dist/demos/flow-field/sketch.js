// Using this variable to decide whether to draw all the stuff
let debug = false;

// flowField object
let flowField;

// An ArrayList of vehicles
const vehicles = [];
const vehicleAmount = 120;
let vehicleSize = 2;
let vehicleSeparation = 1;
let vehicleCohesive = 1;
let vehicleAlignment = 1;
let vehicleFlowField = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Make a new flowField with "resolution" of 40
  flowField = new FlowField((width / height) * 20);
  flowField.init();

  document.getElementById('size').addEventListener('change', (event) => {
    vehicleSize = parseInt(event.target.value, 10);
  });
  
  document.getElementById('separation').addEventListener('change', (event) => {
    vehicleSeparation = parseInt(event.target.value, 10);
  });

  document.getElementById('alignment').addEventListener('change', (event) => {
    vehicleCohesive = parseInt(event.target.value, 10);
  });

  document.getElementById('cohesive').addEventListener('change', (event) => {
    vehicleAlignment = parseInt(event.target.value, 10);
  });
  
  document.getElementById('flowfield').addEventListener('change', (event) => {
    vehicleFlowField = event.target.checked;
  });

  // Make a whole bunch of vehicles with random maxSpeed and maxForce values
  Array.from(Array(vehicleAmount)).map(() => {
    vehicles.push(new Vehicle(random(width), random(height), random(2, 3), random(0.1, 0.5)));
  });
}

function draw() {
  background(0);
  // Display the flowField in "debug" mode
  if (debug) flowField.display();

  // Tell all the vehicles to follow the flow field
  vehicles.map((vehicle) => {
    vehicle.separation = vehicleSeparation;
    vehicle.cohesive = vehicleCohesive;
    vehicle.aligning = vehicleAlignment;
    vehicle.size = vehicleSize;

    if (vehicleFlowField) {
      vehicle.follow(flowField);
    }

    vehicle
      .applyBehaviours(vehicles)
      .draw();
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