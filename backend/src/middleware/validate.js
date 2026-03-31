import {
  registerSchema,
  loginSchema,
  createTodoSchema,
  updateTodoSchema,
  todoIdParamSchema,
  getWeeklyTodosQuerySchema,
  getCurrentReflectionQuerySchema,
  updateReflectionSchema,
} from "../validation/schemas.js";

function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[source] = result.data;
    next();
  };
}

// Auth
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);

// Todos
export const validateCreateTodo = validate(createTodoSchema);
export const validateUpdateTodo = validate(updateTodoSchema);
export const validateTodoIdParams = validate(todoIdParamSchema, "params");
export const validateWeeklyTodosQuery = validate(getWeeklyTodosQuerySchema, "query");

// Reflections
export const validateGetCurrentReflection = validate(getCurrentReflectionQuerySchema, "query");
export const validateUpdateReflection = validate(updateReflectionSchema);
