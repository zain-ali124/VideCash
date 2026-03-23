import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenService.js";
import jwt from "jsonwebtoken";
import imagekit from "../config/imagekit.js";
import Tier from "../models/tierModel.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import Video from "../models/videoModel.js"
import mongoose from "mongoose";
import Transaction from "../models/transactionModel.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, referralCode: referralInput, role, selectedTier, paymentProof } = req.body;

    /* 1️⃣ Validate input */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* 2️⃣ Check existing user */
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        success: false,
        message: "Email already taken",
      });
    }

    /* 3️⃣ Handle referral */
    let referredByUser = null;

    if (referralInput) {
      referredByUser = await User.findOne({ referralCode: referralInput });

      if (!referredByUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }
    }

    /* 4️⃣ Hash password */
    const hashPassword = await bcrypt.hash(password, 10);

    /* 5️⃣ Create user first */
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      referralCode: crypto.randomUUID().slice(0, 8),
      refferedBy: referredByUser?._id || null,
      role,
      selectedTier: selectedTier || null,
      paymentProof: paymentProof || null,
      // avatar will use the default value from schema
    });

    /* 6️⃣ Update referrer's direct referrals after user is created */
    if (referredByUser) {
      referredByUser.directReferrals.push(user._id);
      await referredByUser.save();
    }
    /* 7️⃣ Send response */
    return res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for activation.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, // Now correctly referencing user.avatar
        referralCode: user.referralCode,
        status: user.status,
        selectedTier: user.selectedTier,
        paymentProof: user.paymentProof,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Status check ONLY for normal users
    if (user.role === "user" && user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}. Please wait for activation.`,
      });
    }

    // 5️⃣ Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 6️⃣ Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7️⃣ Remove password before sending response
    user.password = undefined;

    return res.status(200).json({
      success: true,
      accessToken,
      user
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const  id  = req.user.id;

    const user = await User.findById(id)
      .select('name avatar role status totalEarnings referralCode createdAt tier')
      .populate('tier', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Error in getPublicUserProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, password } = req.body;

    // ✅ Update Name
    if (name) user.name = name;

    // ✅ Update Email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
      user.emailVerified = false;
    }

    // ✅ Update Password
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
    }

    // ✅ Upload Avatar to ImageKit
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `avatar_${user._id}_${Date.now()}`,
        folder: "/vidcash_avatars",
      });

      // OPTIONAL: Delete old avatar
      if (user.avatar && user.avatar.includes("imagekit")) {
        try {
          const fileId = uploadResponse.fileId;
          // You can store fileId in DB for proper deletion
        } catch (err) {
          console.log("Old avatar delete failed");
        }
      }

      user.avatar = uploadResponse.url;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        wallet: updatedUser.wallet,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided"
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const accessToken = generateAccessToken(decoded.id);
    
    return res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

export const getTiers = async (req, res) => {
  try {
    const tiers = await Tier.find();
    return res.status(200).json({
      success: true,
      tiers,
    });
  } catch (error) {
    console.error("Get Tiers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching tiers",
    });
  }
};

export const selectTier = async (req, res) => {
  try {
    const { tierId } = req.body;
    const { id } = req.params;

    // 1️⃣ Validate input
    if (!tierId) {
      return res.status(400).json({
        success: false,
        message: "Tier selection is required",
      });
    }

    // 2️⃣ Check if tier exists
    const tier = await Tier.findById(tierId);
    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found",
      });
    }

    // 3️⃣ Get user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4️⃣ Save selected tier
    user.selectedTier = tier._id;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Tier "${tier.name}" selected successfully`,
      selectedTier: tier,
    });
  } catch (error) {
    console.error("Select Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error selecting tier",
    });
  }
};

export const submitPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("selectedTier");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.selectedTier) {
      return res.status(400).json({
        success: false,
        message: "No tier selected. Please select a tier first.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
    }

    const uploadImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `payment_${user._id}_${Date.now()}`,
      folder: "payment-proofs",
    });

    user.paymentProof = uploadImage.url;
    user.status = "pending"; // payment submitted, waiting for admin approval
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment submitted for review",
      imageUrl: uploadImage.url,
    });
  } catch (error) {
    console.error("Error submitting payment proof:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting payment proof",
    });
  }
};


export const getVideoById = async (req, res) => {
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

    if (!video.isActive) {
      return res.status(403).json({
        success: false,
        message: "This video is currently inactive"
      });
    }

    return res.status(200).json({
      success: true,
      video
    });
  } catch (error) {
    console.error("Error in getVideoById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching videos",
      error: error.message
    });
  }
};

export const getVideoStats = async (req, res) => {
  try {
    // Check if user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(req.user._id).populate("tier");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const totalWatched = user.watchedVideos ? user.watchedVideos.length : 0;
    
    // Get today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEarnings = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          type: "earning",
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Get this week's earnings
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEarnings = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          type: "earning",
          createdAt: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Get this month's earnings
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const monthEarnings = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          type: "earning",
          createdAt: { $gte: monthAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalVideosWatched: totalWatched,
        todayEarnings: todayEarnings[0]?.total || 0,
        weekEarnings: weekEarnings[0]?.total || 0,
        monthEarnings: monthEarnings[0]?.total || 0,
        dailyEarning: user.dailyEarning || 0,
        dailyLimit: user.tier?.dailyEarningLimit || 0,
        videosWatchedToday: user.videosWatchedToday || 0,
        tier: user.tier?.name || "No Tier"
      }
    });
  } catch (error) {
    console.error("Error in getVideoStats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


export const getUserEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch only earning-related fields
    const user = await User.findById(userId)
      .select(
        "wallet totalEarnings dailyEarning lastEarningDate lastWithdrawalDate tier directReferrals"
      )
      .populate("tier", "name dailyLimit referralBonus");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      earnings: {
        wallet: user.wallet,
        totalEarnings: user.totalEarnings,
        dailyEarning: user.dailyEarning,
        lastEarningDate: user.lastEarningDate,
        lastWithdrawalDate: user.lastWithdrawalDate,
        tier: user.tier,
        referralCount: user.directReferrals.length,
      },
    });
  } catch (error) {
    console.error("Fetch Earnings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch earning data",
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination (important for scalability)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const withdrawals = await Transaction.find({
      user: userId,
      type: "withdrawal",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({
      user: userId,
      type: "withdrawal",
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWithdrawals: total,
      withdrawals,
    });
  } catch (error) {
    console.error("Withdrawal History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawal history",
    });
  }
};