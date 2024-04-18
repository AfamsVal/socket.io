const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http"); // Add this
const { Server } = require("socket.io");

app.use(cors());

// Create HTTP server using the Express app
const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("data:", data);
    try {
      // Process the data if needed
      socket.emit("receive_message", data);
      socket.broadcast.emit("receive_message", data);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000"); // Update this line
});
