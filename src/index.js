import p5 from 'p5';
import io from 'socket.io-client';
import Person from './person';
import * as dat from 'dat.gui';

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  var gui = new dat.GUI();

  new p5(
    (sketch) => {
      let people = {};
      let firstTime = true;
      let yourId = Date.now();
      let noiseIndex = 0;
      const { 
        createVector
      } = sketch;

      const createUser = (id, color) => {
        return new Person({
          id: id,
          userId: yourId,
          p5: sketch,
          x: 50,
          y: 50,
          maxForce: 10,
          maxSpeed: 5,
          acceleration: 1,
          fill: color,
        });
      }

      sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        sketch.background(40);
        socket.emit('add user', yourId);

        socket.on('mouse', (data) => {
          noiseIndex += 0.2;
          const red = sketch.map(data.x, 0, sketch.width, 0, 255);
          const green = sketch.map(data.y, 0, sketch.height, 0, 255);
          const blue = sketch.noise(noiseIndex) * 255;

          sketch.fill(red, green, blue);
          sketch.noStroke();
          sketch.ellipse(data.x, data.y, 80, 80);
        });

        socket.on('user joined', (data) => {
          const color = data.id !== yourId ? [100, 100, 100] : [255, 255, 255];
          people[data.id] = createUser(data.id, color);

          if (firstTime) {
            gui.addColor(people[data.id], 'fill');
            gui.add(people[data.id], 'mass', 1, 15);
            Object.keys(data.users).forEach((person) => {
              if (parseInt(person) !== yourId) {
                people[person] = createUser(person, [100, 100, 100]);
              }
              firstTime = false;
            });
          }
        });

        socket.on('user updated', (data) => {
          if (!firstTime) {
            people[data.id].pos.set(createVector(data.pos.x, data.pos.y));
            people[data.id].diameter = data.diameter;
            people[data.id].fill = data.fill;
          }
        });

        socket.on('user left', (data) => {
          delete people[data.id];
        });

        socket.on('reconnect', () => {
          if (id) {
            socket.emit('add user', id);
          }
        });
      };

      sketch.mouseDragged = () => {
        // Make a little object with mouseX and mouseY
        let data = {
          x: sketch.mouseX,
          y: sketch.mouseY
        };
        // Send that object to the socket
        socket.emit('mouse', data);
      }

      sketch.draw = () => {
        //sketch.background(40);
        Object.keys(people).forEach((person) => {
          people[person].draw({
            forces: {
              wind: createVector(0.1, 0),
              gravity: createVector(0, 0.2),
            },
            vehicles: people,
          });
        });

        if (!firstTime) {
          people[yourId].diameter = Math.cos(Date.now() / 1000) * 25 + 26;
          socket.emit('update user', {
            id: yourId,
            pos: people[yourId].pos,
            diameter: people[yourId].diameter,
            fill: people[yourId].fill,
          });
        }
      };
    }
  );
});
