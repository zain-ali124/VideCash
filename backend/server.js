import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { initSocket } from "./src/config/socket.js";
import { dbConnect } from "./src/config/db.js";

// Connect to MongoDB
dbConnect();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);
// Start server - ONLY call server.listen(), NOT app.listen()
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

