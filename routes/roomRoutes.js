import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/RoomControllers.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/",  protect,  createRoom);
router.get("/", getRooms); 
router.get("/:id", getRoomById); 
router.put("/:id", protect,updateRoom);
router.delete("/:id", protect, deleteRoom);

export default router;
