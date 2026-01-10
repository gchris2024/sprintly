import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Hook up to express
    navigate("/dashboard");
  };

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginLeft}>
        <h1>Sprintly</h1>
        <p>Declutter your life.</p>
      </section>

      <section className={styles.loginRight}>
        <form className={styles.loginForm}>
          <h2>The Welcome Message</h2>

          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
          <button type="button" className={styles.signUp}>New User? Sign Up</button>
        </form>
      </section>
    </div>
  );
};

export default Login;
