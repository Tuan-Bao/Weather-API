import express from "express";
import rateLimit from "express-rate-limit";
import router from "./routes/weatherRoutes.js";

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, //  1 giờ
  max: 100, // Tối đa 100 yêu cầu mỗi giờ
  message: "To many requests",
});
app.use(limiter);

app.use("/api", router);

export default app;
