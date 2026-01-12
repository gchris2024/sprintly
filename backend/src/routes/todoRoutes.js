import express from "express";
import { prisma } from "../lib/prismaClient.ts";
import { getWeekRange, normalizeDate } from "../utils/time.js";

const router = express.Router();

// Get weekly todos for logged in user
router.get("/", async (req, res) => {
  const { weekStart } = req.query;
  const userId = req.user.userId;

  if (!weekStart) {
    return res
      .status(400)
      .json({ message: "weekStart query param is required" });
  }

  // Get start and end dates for the week
  const { start: weekStartDate, end: weekEndDate } = getWeekRange(weekStart);

  // Fetch todos for the user within the week range
  const todos = await prisma.todo.findMany({
    where: {
      userId,
      date: {
        gte: weekStartDate,
        lt: weekEndDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  res.json(todos);
});

// Create a new todo
router.post("/", async (req, res) => {
  const { task, date, minutes } = req.body; // TODO: Check minutes = 0
  const userId = req.user.userId;

  if (!task || !date) {
    return res
      .status(400)
      .json({ message: "Both task and date fields are required" });
  }

  const todo = await prisma.todo.create({
    data: {
      task,
      userId,
      date: normalizeDate(date),
      minutes,
    },
  });

  // Respond with new task
  res.status(201).json(todo);
});

// Update a todo
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed, date, minutes } = req.body;
  const userId = req.user.userId;

  try {
    const result = await prisma.todo.update({
      // Update only if the todo belongs to the user
      where: {
        id: parseInt(id),
        userId,
      },
      data: {
        ...(completed !== undefined && { completed: !!completed }),
        ...(minutes !== undefined && { minutes }),
        ...(task && { task }),
        ...(date && { date: normalizeDate(date) }),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    // Return 404 if task doesn't exist or doesn't belong to user
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Delete the todo iff it belongs to the user
  try {
    const result = await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    res.send(result);
  } catch (error) {
    // Return 404 if task doesn't exist or doesn't belong to user
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
