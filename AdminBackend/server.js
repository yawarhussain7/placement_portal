import express from "express";
import "dotenv/config";
import connectDB from"./config/db_config.js";

import authRoute from './routes/auth.route.js'

const app = express();
const PORT = process.env.PORT || 5000
connectDB();
// Middleware
app.use(express.json());

// Routes
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello Yawar",
  });
});

// ? Auth Router
app.use('/',authRoute)
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});