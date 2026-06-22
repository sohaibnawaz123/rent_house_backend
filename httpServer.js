const { createServer } = require("http");
const { Server } = require("socket.io");
let io;
const createHttpServer = (app) => {
  const server = createServer(app);
  // Initialize socket.io
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const usersInRoom = {};
  const liveLocations = {};
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      delete usersInRoom[socket.id];
      delete liveLocations[socket.id];
    });
  });
  return server;
};
// Export socket.io instance getter
const getIO = () => io;
module.exports = createHttpServer;
module.exports.getIO = getIO;