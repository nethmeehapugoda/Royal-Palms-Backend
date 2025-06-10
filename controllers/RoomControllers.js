import Room from "../models/Room.js";
import Category from "../models/Category.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

export const createRoom = async (req, res) => {
  try {
    const { category, roomNumber, status } = req.body;
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Handle multiple image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      images = uploadedImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      }));
    }

    const room = new Room({
      category,
      roomNumber,
      images,
      status: status || "available",
    });
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("category", "name price");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "category",
      "name price"
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { category, roomNumber, status, imagesToDelete } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Handle image deletions
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
      const deletePromises = imagesToDelete.map((public_id) =>
        deleteImage(public_id)
      );
      await Promise.all(deletePromises);
      room.images = room.images.filter(
        (img) => !imagesToDelete.includes(img.public_id)
      );
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = uploadedImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      }));
      room.images.push(...newImages);
    }

    // Update other fields
    room.category = category || room.category;
    room.roomNumber = roomNumber || room.roomNumber;
    room.status = status || room.status;

    await room.save();
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Delete associated images from Cloudinary
    if (room.images && room.images.length > 0) {
      const deletePromises = room.images.map((img) =>
        deleteImage(img.public_id)
      );
      await Promise.all(deletePromises);
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
