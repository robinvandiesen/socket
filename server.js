const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('dist'));

let users = {};

io.on('connection', socket => {
  let addedUser = false;

  // When the user disconnects
  socket.on('disconnect', () => {
    if (addedUser) {
      delete users[socket.id];

      // Echo globally that this client has left
      socket.broadcast.emit('user left', {
        id: socket.id,
        users,
      });
    }
  });

  socket.on('mouse', (data) => {
    socket.broadcast.emit('mouse', data);
  });

  socket.on('add user', (id) => {
    if (addedUser) return;
    
    // Store the id in the socket session for this client
    socket.id = id;
    addedUser = true;
    users = {
      ...users,
      [id]: {
        name: 'jim'
      }
    };

    // Echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      id: socket.id,
      users,
    });
  });

  socket.on('update user', (settings) => {
    socket.broadcast.emit('user updated', {
      id: socket.id,
      ...settings
    });
  });
});
const port = normalizePort(process.env.PORT || '3000');
http.listen(port);
