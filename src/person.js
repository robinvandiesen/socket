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
    this.diameter = 10;
    this.acceleration = acceleration;
    this.radius = this.diameter / 2;
    this.maxSpeed = maxSpeed;
    this.p5 = p5;
  }

  applyForce(force) {
    let f = p5Static.Vector.div(force, 10);
    this.acc.add(f);
  };

  draw() {
    this.display();
    this.update();
    this.edges();
  }

  userInput() {
    if (this.userId !== this.id) return;

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

  display() {
    this.p5.fill(this.fill);
    this.p5.ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
  };
}

export default Person
