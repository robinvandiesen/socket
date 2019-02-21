import p5 from 'p5';
import io from 'socket.io-client';
import Person from './person';

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  new p5(
    (sketch) => {
      let people = {};
      let firstTime = true;
      let yourId = Date.now();

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
          // Draw a blue circle
          sketch.fill(sketch.random(0, 255), sketch.random(0, 255), sketch.random(0, 255));
          sketch.noStroke();
          sketch.ellipse(data.x, data.y, 80, 80);
        });

        socket.on('user joined', (data) => {
          const color = data.id !== yourId ? 100 : 255;
          people[data.id] = createUser(data.id, color);

          if (firstTime) {
            Object.keys(data.users).forEach((person) => {
              if (parseInt(person) !== yourId) {
                people[person] = createUser(person, 100);
                console.log(people[person]);
              }
              firstTime = false;
            });
          }
        });

        socket.on('user moved', (data) => {
          if (!firstTime) {
            people[data.id].pos.set(sketch.createVector(data.pos.x, data.pos.y));
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
          people[person].draw();
        });

        if (!firstTime) {
          socket.emit('update user', people[yourId].pos);
        }
      };
    }
  );
});
