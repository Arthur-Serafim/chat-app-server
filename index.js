const express = require("express");
const http = require("http");
const router = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const PORT = process.env.PORT | 5000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connect", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("users", [...getUsersInRoom(user.room)])
    socket.broadcast.to(user.room).emit("users", [...getUsersInRoom(user.room)])

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the room.`
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room.`
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
