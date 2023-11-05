import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../Redux/actions";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (userName) {
      dispatch(createUser(userName));
      navigate("/chat");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Ingrese su nombre de usuario</h2>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Login;
