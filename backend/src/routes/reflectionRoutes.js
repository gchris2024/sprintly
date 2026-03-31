import express from "express";
import { prisma } from "../lib/prismaClient.ts";
import {
  validateGetCurrentReflection,
  validateUpdateReflection,
} from "../middleware/validate.js";

const router = express.Router();

// Get current week reflection for logged in user
// If DNE, create a new reflection with empty fields
router.get(
  "/current",
  validateGetCurrentReflection,
  async (req, res) => {
    const userId = req.user.userId;
    const { weekStart } = req.query;

    // Client sends weekStart in their timezone as ISO string
    const weekStartDate = new Date(weekStart);

    // TODO: Maybe wrap in transaction
    try {
      const reflection = await prisma.reflection.upsert({
        where: {
          userId_weekStart: {
            userId,
            weekStart: weekStartDate,
          },
        },
        update: {},
        create: {
          userId,
          weekStart: weekStartDate,
          wins: "",
          challenges: "",
          nextWeekFocus: "",
        },
      });

      res.json(reflection);
    } catch (error) {
      res.status(500).json({ error: "Failed to get or create reflection" });
    }
  }
);

// Update reflection for the week
router.patch("/current", validateUpdateReflection, async (req, res) => {
  const userId = req.user.userId;
  const { weekStart, wins, challenges, nextWeekFocus } = req.body;

  // Client sends weekStart in their timezone as ISO string
  const weekStartDate = new Date(weekStart);

  try {
    const result = await prisma.reflection.update({
      // Update only if the reflection belongs to the user
      where: {
        userId_weekStart: {
          userId,
          weekStart: weekStartDate,
        },
      },
      data: {
        ...(wins !== undefined && { wins }),
        ...(challenges !== undefined && { challenges }),
        ...(nextWeekFocus !== undefined && { nextWeekFocus }),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    // Return 404 if reflection doesn't exist or doesn't belong to user
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Reflection not found" });
    }
    return res.status(500).json({ error: "Failed to update reflection" });
  }
});

// Get all past reflections for logged in user (future feature)
router.get("/reflections", async (req, res) => {
  const userId = req.user.userId;

  try {
    const reflections = await prisma.reflection.findMany({
      where: {
        userId,
      },
      orderBy: {
        weekStart: "desc",
      },
    });

    res.json(reflections);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch reflections" });
  }
});

export default router;
