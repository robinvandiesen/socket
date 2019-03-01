function Vehicle(x, y, maxSpeed, maxForce) {
  this.position = createVector(x, y);
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.size = 2; 
  this.mass = 1;
  this.maxSpeed = maxSpeed || 4;
  this.maxForce = maxForce || 0.1;
  this.cohesive = 10;

  this.draw = function () {
    this.update();
    this.borders();
    this.display();
  }

  this.follow = function (flowField) {
    const desired = flowField.lookup(this.position);
    desired.mult(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);

    return this;
  }

  this.separate = function (vehicles) {
    const desiredSeparation = this.size * this.cohesive;
    const sum = createVector();
    let count = 0;

    vehicles.map((vehicle, index) => {
      const d = p5.Vector.dist(this.position, vehicle.position);

      if (d > 0 && d < desiredSeparation) {
        // Calculate vector pointing away from neighbor
        const diff = p5.Vector.sub(this.position, vehicle.position);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count = index + 1;
      }
    });

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      // Implement Reynolds: Steering = Desired - Velocity
      const steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }

    return this;
  }

  this.applyForce = function (force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  this.update = function () {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
  }

  this.borders = function () {
    if (this.position.x < -this.size) this.position.x = width + this.size;
    if (this.position.y < -this.size) this.position.y = height + this.size;
    if (this.position.x > width + this.size) this.position.x = -this.size;
    if (this.position.y > height + this.size) this.position.y = -this.size;
  }

  this.display = function () {
    var theta = this.velocity.heading() + PI / 2;
    fill(127);
    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 2);
    vertex(this.size, this.size * 2);
    endShape(CLOSE);
    pop();
  }
}
