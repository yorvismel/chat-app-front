import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getPersonalChats, getAllUsers } from "../Redux/actions";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../Loading/Loading";

const Login = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  const handleLogin = () => {
    if (userName) {
      setIsLoadingChats(true);

      dispatch(createUser(userName));

      // Realiza las operaciones para obtener los chats desde la base de datos
      dispatch(getAllUsers())
        .then(() => dispatch(getPersonalChats(currentUser)))
        .then(() => {
          setIsLoadingChats(false);
          setChatsLoaded(true);
        });
    }
  };

  useEffect(() => {
    if (chatsLoaded) {
      // Cuando los chats se han cargado, navega a la página de chat.
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


