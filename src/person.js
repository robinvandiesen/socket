import * as p5Static from 'p5';

class Person {
  constructor({ p5, x, y, maxSpeed, acceleration, id, userId, fill }) {
    const { createVector } = p5;
    this.id = parseInt(id);
    this.userId = parseInt(userId);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.fill = fill;
    this.mass = 10;
    this.diameter = 20;
    this.gravity = 1;
    this.maxForce = 10;
    this.acceleration = acceleration;
    this.radius = this.diameter / 2;
    this.maxSpeed = maxSpeed;
    this.p5 = p5;

    if (this.userId === this.id) {
      window.addEventListener("deviceorientation", (event) => this.userInput(event), true);
    }
  }

  applyForce(force) {
    let f = p5Static.Vector.div(force, this.mass);
    this.acc.add(f);
  };

  draw({ forces, vehicles }) {
    this.display();
    if (this.userId !== this.id) return;

    if (vehicles) {
      this.collision(vehicles);
    }

    if (forces) {
      Object.keys(forces).forEach((force) => {
        this.applyForce(forces[force]);
      });
    }

    this.update();
    this.edges();
  }

  userInput(event) {
    const {
      keyIsDown,
      createVector,
      RIGHT_ARROW,
      LEFT_ARROW,
      UP_ARROW,
      DOWN_ARROW,
    } = this.p5;

    if (keyIsDown(LEFT_ARROW)) {
      const moveLeft = createVector(-this.acceleration, 0);
      this.applyForce(moveLeft);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      const moveRight = createVector(this.acceleration, 0);
      this.applyForce(moveRight);
    }

    if (keyIsDown(UP_ARROW)) {
      const moveUp = createVector(0, -this.acceleration);
      this.applyForce(moveUp);
    }

    if (keyIsDown(DOWN_ARROW)) {
      const moveDown = createVector(0, this.acceleration);
      this.applyForce(moveDown);
    }

    if (event) {
      const x = event.beta;
      const y = event.gamma;
      const scaleX = 0.045;
      const scaleY = 0.055;
      const xy = createVector(y * scaleY, x * scaleX);

      this.applyForce(xy);
    }
  }

  update() {
    this.userInput();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  edges() {
    const { height, width } = this.p5;
    if (this.pos.y + this.radius >= height) {
      this.vel.y *= -1;
    }
    if (this.pos.y - this.radius <= 0) {
      this.vel.y *= -1;
    }
    if (this.pos.x + this.radius >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.x - this.radius <= 0) {
      this.vel.x *= -1;
    }
  };

  collision(vehicles) {
    const { createVector } = this.p5;
    let desiredSeparation = this.diameter;
    let sum = createVector();
    let count = 0;

    Object.keys(vehicles).forEach((vehicle) => {
      const d = p5Static.Vector.dist(this.pos, vehicles[vehicle].pos);

      if ((d > 0) && (d < desiredSeparation)) {
        // Calculate vector pointing away from neighbor
        const diff = p5Static.Vector.sub(this.pos, vehicles[vehicle].pos);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);

      // Implement Reynolds: Steering = Desired - Velocity
      let steer = p5Static.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  display() {
    this.p5.fill(this.fill[0], this.fill[1], this.fill[2]);
    this.p5.stroke(100, 100, 100);
    this.p5.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
  };
}

export default Person
