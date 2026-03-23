import express from "express";
import cors from "cors"
import authRoute from "./src/routes/authRoutes.js"
import adminRoute from  "./src/routes/adminRoutes.js"
import { watchLimiter } from "./src/middlewares/rateLimit.js";
const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(watchLimiter)
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);




export default app;