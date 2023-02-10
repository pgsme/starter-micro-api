// const { Server } = require("socket.io");

// const io = new Server({
//   cors: {
//     origin: ["http://172.19.196.203", "http://localhost", "http://localhost:3000", "http://172.19.196.203:8080"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

// io.listen(process.env.PORT || 3000);

const express = require("express");
const socket = require("socket.io");
// App setup
const PORT = process.env.PORT || 3000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server, {
  cors: {
    origin: ["https://motionless-boot-tuna.cyclic.app"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("post", (msg) => {
    msg.response = "This is response from server!";
    io.emit("post", msg);
  });
});
