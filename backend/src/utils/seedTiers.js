import mongoose from "mongoose";
import Tier from "../models/tierModel.js";
import dotenv from "dotenv";

dotenv.config();

const tiers = [
  { name: "bronze", price: 1000, multiplier: 1 },
  { name: "silver", price: 3000, multiplier: 1.5 },
  { name: "gold", price: 7000, multiplier: 2 },
  { name: "diamond", price: 15000, multiplier: 3 },
];

const seedTiers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Tier.deleteMany(); // optional: remove old tiers
    await Tier.insertMany(tiers);
    console.log("✅ Tiers seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tiers:", error);
    process.exit(1);
  }
};

seedTiers();