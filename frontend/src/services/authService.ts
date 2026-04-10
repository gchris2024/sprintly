const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AUTH_TOKEN_EXPIRED_EVENT = "auth:token-expired";

function fireTokenExpired() {
  window.dispatchEvent(
    new CustomEvent(AUTH_TOKEN_EXPIRED_EVENT, {
      detail: { message: "Authentication token has expired" },
    }),
  );
}

type AuthResponse = {
  username: string;
  success: boolean;
};

/*
 * Helper functions for backend authentication API calls
 */
export const authService = {
  // Register a new user
  async register(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },

  // Login an existing user
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // Logout the current user
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        fireTokenExpired();
      }

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },
};
