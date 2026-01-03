import express from "express";
import { prisma } from "../lib/prismaClient.ts";
import { getWeekRange, normalizeDate } from "../../utils/time.js";

const router = express.Router();

// Get weekly todos for logged in user
router.get("/", async (req, res) => {
  const { weekStart } = req.query;

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
      userId: req.user.userId,
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
  const { task, date, minutes } = req.body;

  if (!task || !date) {
    return res
      .status(400)
      .json({ message: "Both task and date fields are required" });
  }

  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.user.userId,
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

  const result = await prisma.todo.update({
    // Update only if the todo belongs to the user
    where: {
      id: parseInt(id),
      userId: req.user.userId,
    },
    data: {
      ...(completed !== undefined && { completed: !!completed }),
      ...(minutes !== undefined && { minutes }),
      ...(task && { task }),
      ...(date && { date: normalizeDate(date) }),
    },
  });

  // Return 404 if task doesn't exist or doesn't belong to user
  if (result.count === 0) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({ message: "Todo updated" });
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Delete the todo iff it belongs to the user
  const result = await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId,
    },
  });

  // Return 404 if task doesn't exist or doesn't belong to user
  if (result.count === 0) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.send({ message: "Todo deleted" });
});

export default router;
