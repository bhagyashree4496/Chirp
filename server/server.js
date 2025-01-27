const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { protect } = require("./middleware/AuthMiddleware");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => console.log(`MongoDB connected ${con.connection.host}`))
  .catch((err) => console.log(err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Hello from MERN Chat App");
});
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chats", protect, require("./routes/chatRoutes"));
app.use("/api/messages", protect, require("./routes/messageRoutes"));
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Set up Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chirp-dpgg.vercel.app", // Frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newmessagerecieved) => {
    console.log("New Message Received:", newmessagerecieved);
    if (!newmessagerecieved.chat) {
      console.log("Chat property is missing in newmessagerecieved");
      return;
    }
    let chat = newmessagerecieved.chat;
    chat.users.forEach((user) => {
      console.log(user.name);
      if (user._id === newmessagerecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newmessagerecieved);
    });
  });
  // Handle disconnect
});
