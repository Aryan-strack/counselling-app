const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
let PORT = process.env.PORT || 3000;
const path = require("path");
let client = require("./utils/redisDatabase");
// const authentication = require("./middleware/authentication").authentication
const counselorRoute = require("./router/counselor");
const authRoute = require("./router/auth"); 
const messageRoute = require("./router/message");
const profileRoute = require("./router/profile");
const userStatusRoute = require("./router/userStatus");
const counselorProfileRoute = require("./router/counselingSession");
const adminRoute = require("./router/admin");
const studentRoute = require("./router/student");
const error = require("./controller/error404");
const { Server } = require("socket.io");
const server = http.createServer(app);
const allowedOrigins = [
  "https://counselling-app-ki9p.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow all localhost origins for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error("Not allowed by CORS")); // Block the origin
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true, // Ensure lowercase "credentials"
};

// app.use(authentication)
app.use(cors(corsOptions));
app.use(express.json());
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(profileRoute);
app.use(counselorRoute);
app.use(authRoute);
app.use(messageRoute);
app.use(userStatusRoute);
app.use(adminRoute);
app.use(counselorProfileRoute);
app.use(studentRoute);
// Fallback to React for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
try {
  io.on("connection", async (socket) => {
    // Handle joining the room
    socket.on("join", async ({ room, userId }) => {
      // Leave the previous room if the user was already in one
      if (socket.room) {
        socket.leave(socket.room);
        // Notify the old room that the user is offline
        await client.set(
          [userId],
          JSON.stringify({ status: "offline" }, { EX: 3600 })
        );
        socket
          .to(socket.room)
          .emit("status", { socketId: socket.id, status: "offline" });
      }

      // Join the new room
      socket.join(room);
      await client.set(
        [userId],
        JSON.stringify({ status: "online" }, { EX: 3600 })
      );
      socket.room = room; // Store the current room in the socket object
      socket.userId = userId; // Save the user ID for status tracking
      // Notify the new room that the user is online
      socket.to(room).emit("status", { socketId: socket.id, status: "online" });
    });
    // Handle receiving and broadcasting messages
    socket.on("message", ({ room, data }) => {
      const { _id, message, senderId, file, image, createdAt } = data;
      const newMessage = {
        _id,
        message,
        senderId,
        file,
        image,
        createdAt,
      };
      // Broadcast the message to everyone in the room
      io.to(room).emit("message", newMessage);

      // Optionally, save the message to the database
      // Save message to MongoDB
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      if (socket.room) {
        // Notify the room that the user is offline
        await client.set(
          [socket.userId],
          JSON.stringify({ status: "offline" }, { EX: 3600 })
        );
        io.to(socket.room).emit("status", {
          socketId: socket.id,
          status: "offline",
        });
      }
    });
  });
} catch (error) {
  console.error("Error on websockets or redis", error.message);
}

mongoose.connect(process.env.MONGODB_STRING).then(() => {
  console.log("✅ MongoDB connected successfully!");
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.log("⚠️ MongoDB connection failed, but starting server anyway...");
  console.log("Error:", error.message);
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (without MongoDB)`);
  });
});
