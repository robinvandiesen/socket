function Particle({x, y, mass}) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.mass = mass;

	this.applyForce = (force) => {
		let f = p5.Vector.div(force, this.mass);
		this.acc.add(f);
	};

	this.update = () => {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.set(0, 0);
	};

	this.display = () => {
		fill(255);
		ellipse(this.pos.x, this.pos.y, this.mass*10, this.mass*10);
	};

	this.edges = () => {
		if (this.pos.y > height) {
			this.vel.y *= -1;
			this.pos.y = height;
		}
		if (this.pos.y < 0) {
			this.vel.y *= -1;
			this.pos.y = 0;
		}
		if (this.pos.x > width) {
			this.vel.x *= -1;
			this.pos.x = width;
		}
		if (this.pos.x < 0) {
			this.vel.x *= -1;
			this.pos.x = 0;
		}
	};

	this.calculateAttraction = (particle) => {
		const force = p5.Vector.sub(this.pos, particle.pos);
		let distance = force.mag();
		distance = constrain(distance, 5, 25);
		force.normalize();
		const strength = (1 * this.mass * particle.mass) / (distance * distance);
		force.mult(strength);
		return force;
	}
}

