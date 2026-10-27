const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Recipe Book API is running" });
});

app.use("/api/recipes", require("./routes/recipeRoutes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

const PORT = process.env.PORT || 5000;
if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI. Copy .env.example to .env and configure it.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
