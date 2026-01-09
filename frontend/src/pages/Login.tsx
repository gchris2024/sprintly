import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Hook up to express
    navigate("/dashboard");
  };

  return (
    <div>
      <p>The Home Page of All Time</p>
      <button onClick={handleLogin}>Go to Dashboard</button>
    </div>
  );
};

export default Login;
