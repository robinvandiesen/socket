import p5 from 'p5';
import io from 'socket.io-client';
import Person from './person';

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  new p5(
    (sketch) => {
      let people = {};
      let firstTime = true;
      let localId = Date.now();

      sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        socket.emit('add user', localId);

        socket.on('user joined', (data) => {
          console.log(data.id, 'joined');
          console.log(data);

          people[data.id] = new Person({
            id: data.id,
            userId: localId,
            p5: sketch,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            maxForce: 10,
            maxSpeed: 5,
            acceleration: 1,
            fill: 255,
          });

          if (firstTime) {
            Object.keys(data.users).forEach((person) => {
              people[person] = new Person({
                id: person,
                userId: localId,
                p5: sketch,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                maxForce: 10,
                maxSpeed: 5,
                acceleration: 1,
                fill: 100,
              });
            });

            firstTime = false;
          }
        });

        socket.on('user moved', (data) => {
          if (!firstTime) {
            people[data.id].pos.set(sketch.createVector(data.pos.x, data.pos.y));
          }
        });

        socket.on('user left', (data) => {
          console.log(data.id, 'left');
          console.log(data);
          delete people[data.id];
        });

        socket.on('reconnect', () => {
          console.log('you have been reconnected');
          if (id) {
            socket.emit('add user', id);
          }
        });
      };

      sketch.draw = () => {
        sketch.background(40);
        Object.keys(people).forEach((person) => {
          people[person].draw();
        });

        if (!firstTime) {
          socket.emit('update user', people[localId].pos);
        }
      };
    }
  );
});
