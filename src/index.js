import dotenv from "dotenv";

// Load .env first before any other imports
dotenv.config();  

import connectDB from "./db/index.js";
import { app } from "./app.js";

// Debugging - check if env loaded
console.log("🌍 Loaded ENV:");
console.log({
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MONGO DB connection failed !!! ", err);
  });
