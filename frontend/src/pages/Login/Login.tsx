import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuthContext();

  // TODO: Add error state handling

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (error) {
      console.error("Login failed:", error);
      return;
    }

    navigate("/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Branding */}
      <section className={styles.loginLeft}>
        <h1>Sprintly</h1>
        <p>Declutter your life.</p>
      </section>

      {/* Login Form */}
      <section className={styles.loginRight}>
        <form
          className={styles.loginForm}
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          <h2>{isRegistering ? "Sign Up" : "Sign In"}</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? "Sign Up" : "Login"}</button>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
