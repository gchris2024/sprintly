import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

/* Middleware */
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
/* The route of All Time */
app.get("/", (req, res) => {
  res.json({ message: "Foo" });
});

/* Routes */
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/todos", authMiddleware, todoRoutes);
app.use("/api/reflections", authMiddleware, reflectionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
