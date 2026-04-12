import express from "express";
import { prisma } from "../lib/prismaClient.ts";
import { getWeekRange, parseUTCDate } from "../utils/time.js";
import {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoIdParams,
  validateWeeklyTodosQuery,
} from "../middleware/validate.js";

const router = express.Router();

async function fetchTodosForRange(userId, startDate, endDate) {
  return prisma.todo.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

// Get current week todos for logged in user (default dashboard endpoint)
router.get("/", async (req, res) => {
  const userId = req.user.userId;
  const { start: startDate, end: endDate } = getWeekRange(
    new Date().toISOString(),
  );

  const todos = await fetchTodosForRange(userId, startDate, endDate);

  res.status(200).json(todos);
});

// Get todos for a specific week using weekStart query param
// router.get("/weekly", validateWeeklyTodosQuery, async (req, res) => {
//   const { weekStart } = req.query;
//   const userId = req.user.userId;
//   const { start: startDate, end: endDate } = getWeekRange(weekStart);

//   const todos = await fetchTodosForRange(userId, startDate, endDate);
//   console.log("Fetched requested week todos:", todos);

//   res.json(todos);
// });

// Create a new todo
router.post("/", validateCreateTodo, async (req, res) => {
  const { task, date, minutes } = req.body; // TODO: Check minutes = 0
  const userId = req.user.userId;

  const todo = await prisma.todo.create({
    data: {
      task,
      userId,
      date: parseUTCDate(date),
      minutes,
    },
  });

  // Respond with new task
  res.status(201).json(todo);
});

// Update a todo
router.patch(
  "/:id",
  validateTodoIdParams,
  validateUpdateTodo,
  async (req, res) => {
    const { id } = req.params;
    const { task, completed, date, minutes } = req.body;
    const userId = req.user.userId;

    try {
      const result = await prisma.todo.update({
        // Update only if the todo belongs to the user
        where: {
          id,
          userId,
        },
        data: {
          ...(completed !== undefined && { completed: !!completed }),
          ...(minutes !== undefined && { minutes }),
          ...(task && { task }),
          ...(date && { date: parseUTCDate(date) }),
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
  },
);

// Delete a todo
router.delete("/:id", validateTodoIdParams, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Delete the todo iff it belongs to the user
  try {
    const result = await prisma.todo.delete({
      where: {
        id,
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
