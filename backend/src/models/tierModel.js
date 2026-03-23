import mongoose from "mongoose";

const tierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    multiplier: {
      type: Number,
      required: true,
    },
    dailyEarningLimit: {
      type: Number,
      required: true,
    },
    maxVideosPerDay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Tier = mongoose.model("Tier", tierSchema);

export default Tier;
