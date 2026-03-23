import dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";
import Video from "../models/videoModel.js"
import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";
import { getClientIp } from "../utils/getCLientIp.js";


export const watchVideoAndEarn = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { watchTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID",
      });
    }

    if (!watchTime || watchTime <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid watchTime is required",
      });
    }

    // 🔹 Fetch user with tier
    const user = await User.findById(req.user._id).populate("tier");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.tier)
      return res.status(400).json({ success: false, message: "No tier selected" });

    // 🔹 Fetch video
    const video = await Video.findById(videoId);
    if (!video || !video.isActive) {
      return res.status(404).json({
        success: false,
        message: "Video not found or inactive",
      });
    }

    // 🔹 Prevent duplicate earning
    if (user.watchedVideos.includes(videoId)) {
      return res.status(400).json({
        success: false,
        message: "You already earned from this video",
      });
    }

    // 🔹 75% Watch Rule
    const requiredWatchTime = video.duration * 0.75;
    if (watchTime < requiredWatchTime) {
      return res.status(400).json({
        success: false,
        message: `You must watch at least 75% (${Math.floor(requiredWatchTime)}s)`,
      });
    }

    // ===============================
    // ✅ DAILY RESET LOGIC (Improved)
    // ===============================

    const now = new Date();

    if (user.lastEarningDate) {
      const last = new Date(user.lastEarningDate);

      const isSameDay =
        now.getUTCFullYear() === last.getUTCFullYear() &&
        now.getUTCMonth() === last.getUTCMonth() &&
        now.getUTCDate() === last.getUTCDate();

      if (!isSameDay) {
        user.dailyEarning = 0;
        user.videosWatchedToday = 0;
      }
    } else {
      user.dailyEarning = 0;
      user.videosWatchedToday = 0;
    }

    user.lastEarningDate = now;

    // ===============================
    // ✅ TIER LIMIT CHECKS
    // ===============================

    if (user.videosWatchedToday >= user.tier.maxVideosPerDay) {
      return res.status(400).json({
        success: false,
        message: "Daily video limit reached for your tier",
      });
    }

    const reward = video.reward * user.tier.multiplier;

    if (user.dailyEarning + reward > user.tier.dailyEarningLimit) {
      return res.status(400).json({
        success: false,
        message: "Daily earning limit reached",
      });
    }

    // ===============================
    // ✅ UPDATE EARNINGS
    // ===============================

    user.wallet += reward;           // withdrawable balance
    user.totalEarnings += reward;    // lifetime earnings
    user.dailyEarning += reward;     // today's earnings
    user.videosWatchedToday += 1;

    user.watchedVideos.push(videoId);

    await user.save();

    // ===============================
    // ✅ CREATE TRANSACTION
    // ===============================

    await Transaction.create({
      user: user._id,
      amount: reward,
      type: "earning",
      description: `Earned from video: ${video.title}`,
    });

    return res.status(200).json({
      success: true,
      message: "Reward credited successfully",
      data: {
        reward,
        wallet: user.wallet,
        dailyEarning: user.dailyEarning,
        remainingDailyLimit:
          user.tier.dailyEarningLimit - user.dailyEarning,
      },
    });
  } catch (error) {
    console.error("Watch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("directReferrals", "name email status")
      .select("wallet totalEarnings directReferrals");

    return res.status(200).json({
      success: true,
      totalReferrals: user.directReferrals.length,
      wallet: user.wallet,
      totalEarnings: user.totalEarnings,
      referrals: user.directReferrals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
