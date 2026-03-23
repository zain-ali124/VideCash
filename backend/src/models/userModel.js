import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      lowercase: true,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-4Rp6yBdFr5GKaXf2cK8EpZ5dIYb6i6FLgw&s",
    },
    status: {
      enum: ["pending", "active", "banned", "suspended"],
      type: String,
      default: "pending",
    },
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      default: null,
    },
    paymentProof: {
      type: String,
      default: null,
    },
    selectedTier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      default: null,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    refferedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    dailyEarning: {
      type: Number,
      default: 0,
    },
    lastEarningDate: {
      type: Date,
      default: null,
    },
    lastWithdrawalDate: {
      type: Date,
      default: null,
    },
    watchedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    directReferrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
