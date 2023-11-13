import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, fetchChats, fetchUsers } from "../Redux/actions";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../Loading/Loading";

const Login = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const users = useSelector((state) => state.users);

  const handleLogin = () => {
    if (userName) {
      setIsLoadingChats(true);

      dispatch(addUser(userName));

      dispatch(fetchUsers())
        .then(() => dispatch(fetchChats(userName)))
        .then(() => {
          setIsLoadingChats(false);
          setChatsLoaded(true);
        });
    }
  };

  useEffect(() => {
    if (chatsLoaded) {
      navigate("/chat");
    }
  }, [chatsLoaded, navigate]);

  return (
    <div className="login-container">
      {isLoadingChats ? (
        <Loading />
      ) : (
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
      )}
    </div>
  );
};

export default Login;
