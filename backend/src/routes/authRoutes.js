import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prismaClient.js";

const router = express.Router();

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Helper function to validate input
const validateAuthInput = (username, password) => {
  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return { valid: false, message: "Username is required and must be a non-empty string" };
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return { valid: false, message: "Password is required and must be at least 6 characters" };
  }
  return { valid: true };
};

// Register a new user endpoint /auth/register
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
          username: username.trim(),
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
    res.json({ token });
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
        username: username.trim(),
      },
    });


    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password asynchronously
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
