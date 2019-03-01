const particles = [];
let particleAmount = 10;
let vehicle;

function setup () {
	createCanvas(window.innerWidth, window.innerHeight);
	let i = 0;
	for (i; i < particleAmount; i++) {
		particles[i] = new Particle({
			x: random(width),
			y: random(height),
			mass: random(1, 10),
		})
	}

	//vehicle = new Vehicle({
	//	x: random(width),
	//	y: random(height),
	//	mass: 3,
	//	maxSpeed: 5,
	//	maxForce: 0.2,
	//})
}

function mousePressed (event) {
	particles.push(new Particle({x: mouseX, mass: random(1, 10), y: mouseY}))
	particleAmount = particles.length;
}

function keyPressed (event) {
	console.log(event);

	if (event.key === 'Enter') {
		particles.splice(0, 1);
		particleAmount = particles.length;
	}
}

function draw () {
	background(51);

	//const mouse = createVector(mouseX, mouseY);
	//vehicle.seek(mouse);
	//vehicle.update();
	//vehicle.display();

	let i = 0;
	const wind = createVector(0.1, 0);

	for (i; i < particleAmount; i++) {
		const gravity = createVector(0, 0.2 * particles[i].mass);
		particles[i].applyForce(gravity);

		if (mouseIsPressed) {
			particles[i].applyForce(wind);
		}

		let j = 0;
		for (j; j < particleAmount; j++) {
			if (i !== j) {
				const attractionForce = particles[j].calculateAttraction(particles[i]);
				particles[i].applyForce(attractionForce);
			}
		}


		particles[i].update();
		particles[i].edges();
		particles[i].display();
	}
}
