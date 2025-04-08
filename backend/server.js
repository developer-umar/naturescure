const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Database connection
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/PlantRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const orderRoutes = require("./routes/orderRoutes"); // Order Routes Import
const cartRoutes = require("./routes/cartRoutes");
const emailRoutes=require("./routes/emailRoutes")
const { uploadMiddleware } = require("./Middleware/multer");

const path =require('path')
const _dirname = path.resolve();

dotenv.config(); // Load environment variables

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // React ke liye 5173 (Vite) ya 3000
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added comma here
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api", orderRoutes); // API Calls `/api/orders` पे जाएँगी
app.use("/api", cartRoutes);
app.use("/api", protectedRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/email", emailRoutes);
app.post('/upload', uploadMiddleware, (req, res) => {
  res.json({ message: 'File uploaded successfully!', file: req.file });
});
// ✅ Chatbot Configuration
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ ERROR: Gemini API Key is missing in .env file!");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Chatbot Route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(message);
    const aiResponse = result.response.text();
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Error fetching AI response:", error.message);
    res.status(500).json({ error: "Failed to fetch AI response." });
  }
});

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_,res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
// ✅ Server Port
const PORT = process.env.PORT ||  3000;
app.listen(PORT , () => console.log(`🚀 Server running on port ${PORT}`));
