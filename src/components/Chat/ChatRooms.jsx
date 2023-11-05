import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPersonalChat, getPersonalChats, getAllUsers } from "../Redux/actions";
import "../Chat/ChatRooms.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client"; // Importa socket.io-client

const socket = io("https://chatwebapp-p1px.onrender.com/"); // Reemplaza con la URL de tu servidor WebSocket

const ChatRoom = () => {
  const dispatch = useDispatch();
  const personalChats = useSelector((state) => state.personalChats);
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(getPersonalChats(currentUser));
      dispatch(getAllUsers());
    }

    // Configura escuchadores de eventos del servidor WebSocket
    socket.on("newMessage", (message) => {
      dispatch(getPersonalChats(currentUser));
    });

    return () => {
      // Limpia los escuchadores de eventos cuando el componente se desmonta
      socket.off("newMessage");
    };
  }, [currentUser, dispatch]);

  const handleSendMessage = async () => {
    if (currentUser && message) {
      // Envía el mensaje al servidor a través de WebSocket
      dispatch(createPersonalChat(message, currentUser /* RecipientUser */));
      socket.emit("sendMessage", { message, sender: currentUser });

      setMessage("");
    }
  };
   
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [personalChats]);

  const getRandomIcon = () => {
    const icons = ["user", "smile", "star", "heart", "thumbs-up"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    return randomIcon;
  };

  return (
    <div className="chat-room-container">
      <div className="user-list">
        <h3>Usuarios en la sala:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <FontAwesomeIcon icon={getRandomIcon()} />
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
                <FontAwesomeIcon icon={faThumbsUp} />
                <FontAwesomeIcon icon={getRandomIcon()} />
                {chat.userNameSend}:
              </span>
              <span className="message-text">{chat.message}</span>
              <span className="createdAt">{chat.createdAt}</span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
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
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

// const ChatRoom = () => {
//   const dispatch = useDispatch();
//   const personalChats = useSelector((state) => state.personalChats);
//   const users = useSelector((state) => state.users);
//   const currentUser = useSelector((state) => state.currentUser);
//   const [message, setMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (currentUser) {
//       dispatch(getPersonalChats(currentUser));
//       dispatch(getAllUsers());
//     }
//   }, [currentUser, dispatch]);

//   const handleSendMessage = async () => {
//     if (currentUser && message) {
//       // Llama a la acción para crear el mensaje en la base de datos y, al mismo tiempo, recuperar todos los mensajes
//       dispatch(createPersonalChat(message, currentUser /* RecipientUser */));

//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [personalChats]);

//   const getRandomIcon = () => {
//     const icons = ["user", "smile", "star", "heart", "thumbs-up"];
//     const randomIcon = icons[Math.floor(Math.random() * icons.length)];
//     return randomIcon;
//   };

//   return (
//     <div className="chat-room-container">
//       <div className="user-list">
//         <h3>Usuarios en la sala:</h3>
//         <ul>
//           {users.map((user) => (
//             <li key={user.id}>
//               <FontAwesomeIcon icon={getRandomIcon()} />
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
//                 <FontAwesomeIcon icon={faThumbsUp} />
//                 <FontAwesomeIcon icon={getRandomIcon()} />
//                 {chat.userNameSend}:
//               </span>
//               <span className="message-text">{chat.message}</span>
//               <span className="createdAt">{chat.createdAt}</span>
//             </div>
//           ))}
//           <div ref={messagesEndRef}></div>
//         </div>
//         <div className="message-input-container">
//           <input
//             type="text"
//             placeholder="Escribe un mensaje..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button className="send-button" onClick={handleSendMessage}>
//             Enviar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;
