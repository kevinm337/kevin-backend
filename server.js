// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");// just to initialize and log connection

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Kevin backend is running" });
});

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Fallback for unknown routes
app.get("/api/blogs-debug", (req, res) => {
  res.json({ ok: true, message: "blogs-debug hit" });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});