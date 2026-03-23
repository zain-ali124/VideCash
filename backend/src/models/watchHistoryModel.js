import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    watchedDuration: {
      type: Number,
      required: true,
    },
    rewardGiven: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same user getting reward twice for same video
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.model("WatchHistory", watchHistorySchema);
