function FlowField(resolution) {
  // How large is each "cell" of the flowField
  this.resolution = resolution;

  // Determine the number of columns and rows based on sketch's width and height
  this.cols = Array.from(Array(Math.round(width / this.resolution)), (x, index) => { index });
  this.rows = Array.from(Array(Math.round(height / this.resolution)), (x, index) => { index });
  this.field = {};

  this.init = function () {
    noiseSeed(Date.now());
    var xOff = 0;
    this.cols.map((x, col) => {
      this.field[col] = {};
      var yOff = 0;
      this.rows.map((x, row) => {
        var theta = map(noise(xOff, yOff), 0, 1, 0, TWO_PI);
        this.field[col][row] = createVector(cos(theta), sin(theta));
        yOff += 0.1;
      });
      xOff += 0.1;
    });
  };

  // Draw every vector
  this.display = function () {
    this.cols.map((x, col) => {
      this.rows.map((x, row) => {
        drawVector(this.field[col][row], col * this.resolution, row * this.resolution, this.resolution - 2);
      });
    });
  };

  this.lookup = function (lookup) {
    var column = Math.floor(constrain(lookup.x / this.resolution, 0, (width / this.resolution) - 1));
    var row = Math.floor(constrain(lookup.y / this.resolution, 0, (height / this.resolution) - 1));
    return this.field[column][row].copy();
  };

  // Renders a vector object 'v' as an arrow and a location 'x,y'
  var drawVector = function (v, x, y, scale) {
    push();
    // Translate to location to render vector
    translate(x, y);
    stroke(200, 100);
    // Call vector heading function to get direction (note that pointing to the right is a heading of 0) and rotate
    rotate(v.heading());
    // Calculate length of vector & scale it to be bigger or smaller if necessary
    var len = v.mag() * scale;
    // Draw three lines to make an arrow (draw pointing up since we've rotate to the proper direction)
    line(0, 0, len, 0);
    pop();
  };
}