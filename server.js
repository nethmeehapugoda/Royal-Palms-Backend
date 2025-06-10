import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import catogaryRoutes from "./routes/cateogoryRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//API routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/category", catogaryRoutes);
app.use("/api/room", roomRoutes);
mongoose
  .connect(process.env.MONGO_URI, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("mongoDB connection error", error));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


