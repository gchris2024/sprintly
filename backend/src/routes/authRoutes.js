import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateAuthInput } from "../utils/validateAuthInput.js";
import { prisma } from "../lib/prismaClient.ts";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// TODO: Refresh tokens

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

/* Register a new user endpoint /api/auth/register */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const validation = validateAuthInput(username, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    // Use transaction to ensure both user and todo are created together
    const result = await prisma.$transaction(async (tx) => {
      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await tx.user.create({
        data: {
          username: validation.data.username,
          password: hashedPassword,
        },
      });

      // Create initial todo
      const firstTodo = `Explore the platform`;
      await tx.todo.create({
        data: {
          task: firstTodo,
          userId: user.id,
        },
      });

      return user;
    });

    // Create a token
    const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // (Can return other non-sensitive user info as needed)
    res.json({ success: true, username: result.username });
  } catch (err) {
    console.error("Registration error:", err.message);

    // Handle Prisma unique constraint violation (duplicate username)
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Generic server error
    res.status(500).json({ message: "Internal server error" });
  }
});

/* Login endpoint /api/auth/login */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const validation = validateAuthInput(username, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: validation.data.username,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password asynchronously
    const passwordIsValid = await bcrypt.compare(
      validation.data.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // (Can return other non-sensitive user info as needed)
    res.json({ success: true, username: user.username });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* Logout endpoint /api/auth/logout */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

/* Get current user endpoint /api/auth/me */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, username: user.username });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Auth me error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
