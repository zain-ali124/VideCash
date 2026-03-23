import Withdrawl from "../models/withdrawlModel.js";
import User from "../models/userModel.js";

export const withdrawAmount = async (req, res) => {
  try {
    const { amount, accountDetails } = req.body;
    if (!amount || !accountDetails || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter valid amount or account details",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (amount < 4) {
      return res.status(400).json({
        success: false,
        message: " Minimum amount must be 100",
      });
    }
    if (user.wallet < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }
    if (user.lastWithdrawalDate) {
      const lockDays = parseInt(process.env.WITHDRAW_LOCK_DAYS) || 14;
      const difDays =
        Date.now() - user.lastWithdrawalDate.getTime() / (1000 * 60 * 60 * 24);
      if (difDays < lockDays) {
        return res.status(400).json({
          success: false,
          message: `You must wait ${lockDays} days between withdrawals`,
        });
      }
    }
    const withdrawal = await Withdrawl.create({
        user: req.user,
        amount,
        accountDetails,
    })
     res.status(201).json({
      success: true,
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
