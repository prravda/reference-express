import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { MongooseConnection } from "./databases/mongoose-connection.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
MongooseConnection.connect();

// Routes
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
