const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: ["http://172.19.196.203", "http://localhost", "http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

io.listen(process.env.PORT || 3000);
