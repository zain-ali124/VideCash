import mongoose from "mongoose";

const withdrawlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount:{
    type: Number,
    required: true,
  },
    status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    },
    accountDetails: {
      type: String, // bank / UPI / crypto etc.
      required: true,
    },
}, { timestamps: true });

const Withdrawl = mongoose.model("Withdrawl", withdrawlSchema);
export default Withdrawl;