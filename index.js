import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Connect to MongoDB when the Vercel serverless function starts
connectDB();

export default app;
