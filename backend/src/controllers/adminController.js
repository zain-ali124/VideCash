import User from "../models/userModel.js";
import Video from "../models/videoModel.js"
import imagekit from "../config/imagekit.js";
import Transaction from "../models/transactionModel.js";
import Withdrawl from "../models/withdrawlModel.js";
import dotenv from "dotenv"
dotenv.config();

export const getPendingUSers = async (req, res) => {
  const users = await User.find({ status: "pending" }).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};

export const getAllUsers = async ( req, res ) =>{
  try {
    const users = await User.find();
    res.status(200).json({
      success:true,
      count: users.length,
      users,
    })
  } catch (error) {
     res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
}

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const REFERRAL_BONUS = parseInt(process.env.REFERRAL_BONUS) || 5;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.selectedTier || !user.paymentProof) {
      return res.status(400).json({
        success: false,
        message: "No tier selected or payment not submitted",
      });
    }

    // ✅ Check if user is already approved to prevent duplicate processing
    if (user.status === "active") {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
      });
    }

    // ✅ Assign tier properly
    user.tier = user.selectedTier;
    user.status = "active";

    // ✅ Process referral bonus if user was referred and bonus not already paid
    if (user.refferedBy && !user.referralBonusPaid) {
      const referrer = await User.findById(user.refferedBy);

      if (referrer) {
        // Update referrer's wallet and earnings
        referrer.wallet = (referrer.wallet || 0) + REFERRAL_BONUS;
        referrer.totalEarnings = (referrer.totalEarnings || 0) + REFERRAL_BONUS;

        // Save referrer first
        await referrer.save();

        // Create transaction record for the bonus
        // Make sure you have Transaction model imported
        await Transaction.create({
          user: referrer._id,
          amount: REFERRAL_BONUS,
          type: "referral_bonus",
          description: `Referral bonus for ${user.email || user._id}`,
          status: "completed",
          date: new Date()
        });

        // Mark that this referral bonus was paid
        user.referralBonusPaid = true;
        
        console.log(`Referral bonus of ${REFERRAL_BONUS} added to referrer ${referrer._id}`);
      }
    }

    // Save user once with all changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
      data: {
        userId: user._id,
        tier: user.tier,
        status: user.status,
        referralBonusProcessed: user.referralBonusPaid || false,
        referralBonusAmount: user.refferedBy ? REFERRAL_BONUS : 0
      }
    });
  } catch (error) {
    console.error("Error in approveUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const rejectUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  user.status = "banned";
  await user.save();
  res.status(200).json({
    success: true,
    message: "User rejected and banned",
  });
};
// withdrawal controllers

export const approveWithdraw = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawl.findById(id).populate("user");

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Withdrawal already processed",
      });
    }

    const user = withdrawal.user;

    // Validate withdrawal amount
    if (withdrawal.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdrawal amount",
      });
    }

    // Check wallet balance
    if (user.wallet < withdrawal.amount) {
      return res.status(400).json({
        success: false,
        message: "User wallet insufficient",
      });
    }

    // 🔻 Deduct from wallet
    user.wallet -= withdrawal.amount;

    // 🔻 Update total earnings (as requested)
    user.totalEarnings -= withdrawal.amount;

    // Safety check (never allow negative earnings)
    if (user.totalEarnings < 0) {
      user.totalEarnings = 0;
    }

    // Update withdrawal metadata
    user.lastWithdrawalDate = new Date();
    withdrawal.status = "approved";

    await user.save();
    await withdrawal.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal approved successfully",
    });
  } catch (error) {
    console.error("Approve Withdrawal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while approving withdrawal",
    });
  }
};


export const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Withdrawal already processed",
      });
    }

    withdrawal.status = "rejected";
    await withdrawal.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal rejected",
    });
  } catch (error) {
    console.error("Reject Withdrawal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const uploadVideoController = async (req, res) => {
  try {
    const { title, duration, reward } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    // Convert buffer to base64
    const fileBase64 = req.file.buffer.toString("base64");

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBase64,
      fileName: Date.now() + "-" + req.file.originalname,
      folder: "/videos",
    });

    // Save to DB
    const video = await Video.create({
      title,
      videoUrl: response.url, // ImageKit URL
      duration: Number(duration),
      reward: Number(reward),
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded to ImageKit successfully",
      video,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @access  Private (Admin)
export const toggleVideoStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID"
      });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    video.isActive = !video.isActive;
    await video.save();

    return res.status(200).json({
      success: true,
      message: `Video ${video.isActive ? 'activated' : 'deactivated'} successfully`,
      video
    });
  } catch (error) {
    console.error("Error in toggleVideoStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error toggling video status",
      error: error.message
    });
  }
};

// @desc    Get video analytics
// @route   GET /api/admin/videos/analytics
// @access  Private (Admin)
export const getVideoAnalytics = async (req, res) => {
  try {
    // Total videos
    const totalVideos = await Video.countDocuments();
    const activeVideos = await Video.countDocuments({ isActive: true });
    
    // Most watched videos
    const mostWatched = await Video.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views reward");

    // Total earnings from all videos
    const totalEarnings = await Transaction.aggregate([
      { $match: { type: "earning" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Videos added over time (for charts)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const videosOverTime = await Video.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalVideos,
        activeVideos,
        inactiveVideos: totalVideos - activeVideos,
        mostWatched,
        totalEarnings: totalEarnings[0]?.total || 0,
        videosOverTime
      }
    });
  } catch (error) {
    console.error("Error in getVideoAnalytics:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};