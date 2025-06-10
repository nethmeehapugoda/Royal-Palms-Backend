import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  images: [
    {
      type: String, 
    },
  ],
  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available",
  },
});

export default mongoose.model("Room", roomSchema);
