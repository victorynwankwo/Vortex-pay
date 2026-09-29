import dotenv from "dotenv";
import app from "./app.js";
import pool from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Vortex-Pay running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();