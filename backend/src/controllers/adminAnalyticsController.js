import User from "../models/userModel.js"
import Transaction from "../models/transactionModel.js";
import Withdrawl from "../models/withdrawlModel.js";
import mongoose from "mongoose";
import Video from "../models/videoModel.js"


export const getAdminDashboard = async (req, res) => {
  try {
    /* ------------------ USER STATS ------------------ */

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });

    /* ------------------ WALLET / EARNINGS ------------------ */

    const totalPlatformEarnings = await Transaction.aggregate([
      { $match: { type: { $in: ["earning", "referral_bonus"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalWithdrawals = await Withdrawl.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const pendingWithdrawals = await Withdrawl.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    /* ------------------ REFERRAL STATS ------------------ */

    const totalReferralCommissions = await Transaction.aggregate([
      { $match: { type: "referral_bonus" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    /* ------------------ MONTHLY REVENUE ------------------ */

    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: { type: { $in: ["earning", "referral_bonus"] } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    /* ------------------ TOP EARNERS ------------------ */

    const topEarners = await User.find()
      .sort({ totalEarnings: -1 })
      .limit(5)
      .select("name email totalEarnings wallet");

    /* ------------------ TOP REFERRERS ------------------ */

    const topReferrers = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          referralCount: {
            $size: {
              $ifNull: ["$directReferrals", []]
            }
          }
        }
      },
      { $sort: { referralCount: -1 } },
      { $limit: 5 }
    ]);

    /* ------------------ VIDEO STATS ------------------ */

    // Total videos count
    const totalVideos = await Video.countDocuments();
    
    // Active videos count
    const activeVideos = await Video.countDocuments({ isActive: true });
    
    // Inactive videos count
    const inactiveVideos = await Video.countDocuments({ isActive: false });
    
    // Total video views (you'll need to track this - if you have a View model/collection)
    // Assuming you have a View model that tracks video views
    let totalVideoViews = 0;
    if (mongoose.models.View) {
      const viewsResult = await View.aggregate([
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]);
      totalVideoViews = viewsResult[0]?.total || 0;
    }
    
    // Average reward per video
    const avgRewardResult = await Video.aggregate([
      { $group: { _id: null, avgReward: { $avg: "$reward" } } }
    ]);
    const averageReward = avgRewardResult[0]?.avgReward || 0;
    
    // Total potential earnings from all videos (reward * views if you have views)
    // Or just total rewards sum
    const totalRewardsSum = await Video.aggregate([
      { $group: { _id: null, total: { $sum: "$reward" } } }
    ]);
    
    // Recent videos (last 5)
    const recentVideos = await Video.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("addedBy", "name email")
      .select("title reward duration isActive createdAt");
    
    // Most watched videos (if you have views tracking)
    let mostWatchedVideos = [];
    if (mongoose.models.View) {
      mostWatchedVideos = await View.aggregate([
        { $group: { _id: "$videoId", views: { $sum: "$count" } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "_id",
            as: "video"
          }
        },
        { $unwind: "$video" },
        {
          $project: {
            title: "$video.title",
            views: 1,
            reward: "$video.reward"
          }
        }
      ]);
    }
    
    // Videos by month (for chart)
    const videosByMonth = await Video.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // Earnings by video (if you have a way to track which video generated earnings)
    // This would require linking transactions to videos in your schema

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalPlatformEarnings: totalPlatformEarnings[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        pendingWithdrawals: pendingWithdrawals[0]?.total || 0,
        totalReferralCommissions: totalReferralCommissions[0]?.total || 0,
      },
      videoStats: {
        totalVideos,
        activeVideos,
        inactiveVideos,
        totalVideoViews,
        averageReward: Math.round(averageReward * 100) / 100, // Round to 2 decimals
        totalRewardsSum: totalRewardsSum[0]?.total || 0,
        recentVideos,
        mostWatchedVideos,
        videosByMonth,
      },
      monthlyRevenue,
      topEarners,
      topReferrers,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};