import {
  register,
  login,
  getProfile,
  refreshToken,
  submitPaymentProof,
  selectTier,
  getTiers,
  updateUserProfile,
  getAllVideos,
  getVideoById,
  getVideoStats,
  getUserEarnings,
  getUserTransactions,
  getWithdrawalHistory,
} from "../controllers/authController.js";
import { watchVideoAndEarn,  getReferralStats } from "../controllers/earnVideoReward.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { withdrawAmount } from "../controllers/withdrawalController.js";
import { watchLimiter } from "../middlewares/rateLimit.js";
import Video from "../models/videoModel.js"
const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.put('/profile', protect, upload.single("avatar"), updateUserProfile)
router.get("/profile", protect, getProfile);
router.get("/refreshToken", refreshToken);
router.get("/tiers", getTiers);
router.post("/selectTier/:id", selectTier);
router.post("/submitPaymentProof/:id",  upload.single("paymentProof"), submitPaymentProof);


router.post('/withdraw', protect, withdrawAmount);
router.get('/withdrawals', protect, getWithdrawalHistory)
router.get('/transactions', protect, getUserTransactions)

router.get('/earning', protect, getUserEarnings)
router.post("/earnVideoReward/:videoId", protect, watchLimiter, watchVideoAndEarn);
router.get("/referral-stats", protect, getReferralStats);

router.get('/videos', protect,  getAllVideos)
router.get('/video/:id', protect, getVideoById)
router.get('/video-stats', getVideoStats)


export default router;
