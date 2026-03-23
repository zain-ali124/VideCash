import rateLimit from "express-rate-limit";

// 🎥 Watch video limiter
export const watchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 50, // only 5 watch attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // limit per user + IP combo
    return req.user?._id?.toString() + "-" + req.ip;
  },
  message: {
    success: false,
    message: "Too many watch attempts. Please slow down.",
  },
});
