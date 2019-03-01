function Vehicle(x, y, maxSpeed, maxForce) {
  this.position = createVector(x, y);
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.size = 2;
  this.mass = 1;
  this.maxSpeed = maxSpeed || 4;
  this.maxForce = maxForce || 0.1;
  this.separation = 1;
  this.cohesive = 1;
  this.aligning = 1;

  this.draw = function () {
    this.update();
    this.borders();
    this.display();
  }

  this.applyForce = function (force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  // We accumulate a new acceleration each time based on three rules
  this.applyBehaviours = function (vehicles) {
    const separate = this.separate(vehicles); // Separation
    const alignment = this.align(vehicles);    // Alignment
    const cohesion = this.cohesion(vehicles); // Cohesion

    // Arbitrarily weight these forces
    separate.mult(this.separation);
    alignment.mult(this.cohesive);
    cohesion.mult(this.aligning);

    // Add the force vectors to acceleration
    this.applyForce(separate);
    this.applyForce(alignment);
    this.applyForce(cohesion);

    return this;
  };

  this.follow = function (flowField) {
    const desired = flowField.lookup(this.position);
    desired.mult(this.maxSpeed);
    // Implement Reynolds: Steering = Desired - Velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);

    return this;
  }

  this.separate = function (vehicles) {
    const desiredSeparation = 12 * this.size;
    const steer = createVector(0, 0);
    let count = 0;
    vehicles.map((vehicle) => {
      var d = p5.Vector.dist(this.position, vehicle.position);

      if ((d > 0) && (d < desiredSeparation)) {
        var diff = p5.Vector.sub(this.position, vehicle.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    });

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }

    return steer;
  }

  this.seek = function (target) {
    const desired = p5.Vector.sub(target, this.position);
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxSpeed);
    // Steering = Desired minus Velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce); // Limit to maximum steering force
    return steer;
  };

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  this.align = function (vehicles) {
    const neighborDist = 25 * this.size;
    const sum = createVector(0, 0);
    let count = 0;

    vehicles.map((vehicle) => {
      const d = p5.Vector.dist(this.position, vehicle.position);
      if ((d > 0) && (d < neighborDist)) {
        sum.add(vehicle.velocity);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      var steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby vehicles, calculate steering vector towards that location
  this.cohesion = function (vehicles) {
    const neighborDist = 25 * this.size;
    const sum = createVector(0, 0);
    let count = 0;

    vehicles.map((vehicle) => {
      var d = p5.Vector.dist(this.position, vehicle.position);
      if ((d > 0) && (d < neighborDist)) {
        sum.add(vehicle.position);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
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
    const red = map(this.position.x, 0, width, 0, 100);
    const green = 100;
    const blue = map(this.position.y, 0, height, 0, 255);
    fill([red, green, blue]);
    stroke([red, green, blue]);
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
