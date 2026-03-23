import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  approveUser,
  approveWithdraw,
  getAllUsers,
  getPendingUSers,
  rejectUser,
  rejectWithdrawal,
  uploadVideoController,
} from "../controllers/adminController.js";
import { uploadVideo } from "../middlewares/uploadMiddleware.js";
import { getAdminDashboard } from "../controllers/adminAnalyticsController.js";
import Withdrawl from "../models/withdrawlModel.js";
import Video from "../models/videoModel.js";
const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.put("/approve/:id", protect, adminOnly, approveUser);
router.put("/reject/:id", protect, adminOnly, rejectUser);
router.get("/pending-users", protect, adminOnly, getPendingUSers);

router.post(
  "/upload-video",
  protect,
  adminOnly,
  uploadVideo.single("video"),
  uploadVideoController,
);
router.get("/getAllWithdrawals", protect, adminOnly, async (req, res) => {
  try {
    const withdrawals = await Withdrawl.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put("/approveWithdraw/:id", protect, adminOnly, approveWithdraw);
router.put("/rejectWithdraw/:id", protect, adminOnly, rejectWithdrawal);
// Add these to your admin routes

router.get("/getAllVideos", protect, adminOnly, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/toggle-video/:id", protect, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true },
    );
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete-video/:id", protect, adminOnly, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

export default router;
