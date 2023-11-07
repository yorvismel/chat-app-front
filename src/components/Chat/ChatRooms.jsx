import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createPersonalChat,
  getPersonalChats,
  getAllUsers,
} from "../Redux/actions";
import "../Chat/ChatRooms.css";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRandomIcon } from "./icons";
const socket = io("https://chatwebapp-p1px.onrender.com");

const ChatRoom = () => {
  const dispatch = useDispatch();
  const personalChats = useSelector((state) => state.personalChats);
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const [message, setMessage] = useState("");
  const [userIcons, setUserIcons] = useState({});
  const [isTyping, setIsTyping] = useState(false); // Nuevo estado para el indicador de escritura
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(getPersonalChats(currentUser));
      dispatch(getAllUsers());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    socket.on("chat message", (newMessage) => {
      if (currentUser) {
        dispatch(getPersonalChats(currentUser));
        scrollToBottom();
      }
    });
  }, [currentUser, dispatch]);

  useEffect(() => {
    const storedUserIcons = JSON.parse(localStorage.getItem("userIcons")) || {};
    setUserIcons(storedUserIcons);
  }, []);

  const handleSendMessage = () => {
    if (currentUser && message) {
      dispatch(createPersonalChat(message, currentUser));
      socket.emit("chat message", message);
      setMessage("");
      setIsTyping(false); // Cuando se envía un mensaje, el usuario deja de escribir
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      const messagesContainer = document.querySelector(".messages");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [personalChats]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const getUserIcon = (userName) => {
    if (userIcons[userName]) {
      return userIcons[userName];
    } else {
      const randomIcon = getRandomIcon();
      setUserIcons((icons) => ({ ...icons, [userName]: randomIcon }));
      localStorage.setItem("userIcons", JSON.stringify(userIcons));
      return randomIcon;
    }
  };

  const handleTyping = () => {
    // Cuando el usuario comienza a escribir, establece isTyping en true
    setIsTyping(true);

    // Establece un temporizador para indicar que el usuario dejó de escribir después de un cierto tiempo
    setTimeout(() => {
      setIsTyping(false);
    }, 1000); // Por ejemplo, 1 segundo
  };

  return (
    <div className="chat-room-container">
      <div className="user-list">
        <h3>Usuarios en la sala:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <FontAwesomeIcon icon={getUserIcon(user.userName)} size="sm" />
              {user.userName}
            </li>
          ))}
        </ul>
      </div>
      <div className="conversation-container">
        <div className="messages" ref={messagesEndRef}>
          {personalChats.map((chat, index) => (
            <div key={index} className="message">
              <span className="sender">
                <FontAwesomeIcon
                  icon={getUserIcon(chat.userNameSend)}
                  size="lg"
                />
                {chat.userNameSend}:
              </span>
              <span className="message-text">{chat.message}</span>
              <span className="createdAt">{chat.createdAt}</span>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <div className="message-input-container">
            <input
              type="text"
              placeholder={
                isTyping
                  ? `${currentUser} está escribiendo...`
                  : "Escribe un mensaje..."
              }
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={isTyping}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;




// import { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   createPersonalChat,
//   getPersonalChats,
//   getAllUsers,
// } from "../Redux/actions";
// import "../Chat/ChatRooms.css";
// import io from "socket.io-client";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { getRandomIcon } from "./icons";
// const socket = io("https://chatwebapp-p1px.onrender.com");

// const ChatRoom = () => {
//   const dispatch = useDispatch();
//   const personalChats = useSelector((state) => state.personalChats);
//   const users = useSelector((state) => state.users);
//   const currentUser = useSelector((state) => state.currentUser);
//   const [message, setMessage] = useState("");
//   const [userIcons, setUserIcons] = useState({});
//   const messagesEndRef = useRef(null);

//   // Efecto para cargar los chats y usuarios cuando el componente se monta
//   useEffect(() => {
//     if (currentUser) {
//       dispatch(getPersonalChats(currentUser));
//       dispatch(getAllUsers());
//     }
//   }, [currentUser, dispatch]);

//   // Efecto para escuchar nuevos mensajes desde el servidor
//   useEffect(() => {
//     socket.on("chat message", (newMessage) => {
//       // Realiza una actualización de los chats si es necesario
//       if (currentUser) {
//         dispatch(getPersonalChats(currentUser));
//         scrollToBottom();
//       }
//     });
//   }, [currentUser, dispatch]);

//   // Efecto para cargar los iconos de usuario almacenados en localStorage
//   useEffect(() => {
//     const storedUserIcons = JSON.parse(localStorage.getItem("userIcons")) || {};
//     setUserIcons(storedUserIcons);
//   }, []);

//   const handleSendMessage = () => {
//     if (currentUser && message) {
//       dispatch(createPersonalChat(message, currentUser));
//       socket.emit("chat message", message);
//       setMessage("");
//       scrollToBottom();
//     }
//   };
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//       const messagesContainer = document.querySelector(".messages");
//       if (messagesContainer) {
//         messagesContainer.scrollTop = messagesContainer.scrollHeight;
//       }
//     }
//   }, [personalChats]);

//   // Función para desplazar el scroll al fondo
//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
//     }
//   };

//   const getUserIcon = (userName) => {
//     if (userIcons[userName]) {
//       return userIcons[userName];
//     } else {
//       const randomIcon = getRandomIcon();
//       setUserIcons((icons) => ({ ...icons, [userName]: randomIcon }));
//       localStorage.setItem("userIcons", JSON.stringify(userIcons));
//       return randomIcon;
//     }
//   };

//   return (
//     <div className="chat-room-container">
//       <div className="user-list">
//         <h3>Usuarios en la sala:</h3>
//         <ul>
//           {users.map((user) => (
//             <li key={user.id}>
//               <FontAwesomeIcon icon={getUserIcon(user.userName)} size="sm" />
//               {user.userName}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="conversation-container">
//         <div className="messages" ref={messagesEndRef}>
//           {personalChats.map((chat, index) => (
//             <div key={index} className="message">
//               <span className="sender">
//                 <FontAwesomeIcon
//                   icon={getUserIcon(chat.userNameSend)}
//                   size="lg"
//                 />
//                 {chat.userNameSend}:
//               </span>
//               <span className="message-text">{chat.message}</span>
//               <span className="createdAt">{chat.createdAt}</span>
//             </div>
//           ))}
//         </div>
//         <form onSubmit={(e) => e.preventDefault()}>
//           <div className="message-input-container">
//             <input
//               type="text"
//               placeholder="Escribe un mensaje..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button className="send-button" onClick={handleSendMessage}>
//               Enviar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;
