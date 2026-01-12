// TODO: Replace with Zod schema validation
export const validateAuthInput = (username, password) => {
  if (typeof username !== "string") {
    return { valid: false, message: "Username is required and must be a string" };
  }

  const normalizedUsername = username.trim();

  if (normalizedUsername.length === 0) {
    return { valid: false, message: "Username cannot be empty" };
  }

  // Restrict to alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  if (typeof password !== "string") {
    return { valid: false, message: "Password is required and must be a string" };
  }

  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters",
    };
  }

  return {
    valid: true,
    data: {
      username: normalizedUsername,
      password,
    },
  };
};
