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
  const messagesEndRef = useRef(null);

  // Efecto para cargar los chats y usuarios cuando el componente se monta
  useEffect(() => {
    if (currentUser) {
      dispatch(getPersonalChats(currentUser));
      dispatch(getAllUsers());
    }
  }, [currentUser, dispatch]);

  // Efecto para escuchar nuevos mensajes desde el servidor
  useEffect(() => {
    socket.on("chat message", (newMessage) => {
      // Realiza una actualización de los chats si es necesario
      if (currentUser) {
        dispatch(getPersonalChats(currentUser));
      }
    });
  }, [currentUser, dispatch]);

  // Efecto para cargar los iconos de usuario almacenados en localStorage
  useEffect(() => {
    const storedUserIcons = JSON.parse(localStorage.getItem("userIcons")) || {};
    setUserIcons(storedUserIcons);
  }, []);

  const handleSendMessage = () => {
    if (currentUser && message) {
      dispatch(createPersonalChat(message, currentUser));
      // Emitir el mensaje al servidor
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  // Efecto para desplazarse al final de la lista de mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [personalChats]);

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
        <div className="messages">
          {personalChats.map((chat, index) => (
            <div key={index} className="message">
              <span className="sender">
                <FontAwesomeIcon icon={getUserIcon(chat.userNameSend)} size="lg" />
                {chat.userNameSend}:
              </span>
              <span className="message-text">{chat.message}</span>
              <span className="createdAt">{chat.createdAt}</span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="message-input-container">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="send-button" onClick={handleSendMessage}>
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

// const socket = io("http://localhost:3001/");

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
//     socket.on("newMessage", (newMessage) => {
//       // Realiza una actualización de los chats si es necesario
//       if (currentUser && newMessage.sender !== currentUser) {
//         dispatch(getPersonalChats(currentUser));
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
//       socket.emit("sendMessage", { message, sender: currentUser });
//       setMessage("");
//     }
//   };

//   // Efecto para desplazarse al final de la lista de mensajes
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [personalChats]);

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
//         <div className="messages">
//           {personalChats.map((chat, index) => (
//             <div key={index} className="message">
//               <span className="sender">
//                 <FontAwesomeIcon icon={getUserIcon(chat.userNameSend)} size="lg" />
//                 {chat.userNameSend}:
//               </span>
//               <span className="message-text">{chat.message}</span>
//               <span className="createdAt">{chat.createdAt}</span>
//             </div>
//           ))}
//           <div ref={messagesEndRef}></div>
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
