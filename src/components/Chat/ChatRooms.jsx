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

// const socket = io("http://localhost:3001");
const socket = io("https://chatwebapp-p1px.onrender.com");

const ChatRoom = () => {
  const dispatch = useDispatch();
  const personalChats = useSelector((state) => state.personalChats);
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState({});
  const userIcons = useRef(JSON.parse(localStorage.getItem("userIcons")) || {});
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

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
    socket.on("typing", (data) => {
      const updatedIsTyping = { ...isTyping };

      if (data.typing) {
        updatedIsTyping[data.user] = true;
      } else {
        delete updatedIsTyping[data.user];
      }

      setIsTyping(updatedIsTyping);

      // Eliminar el mensaje de escritura después de 3 segundos
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        updatedIsTyping[data.user] = false;
        setIsTyping(updatedIsTyping);
      }, 3000);
    });
  }, [isTyping]);

  const handleSendMessage = () => {
    if (currentUser && message) {
      dispatch(createPersonalChat(message, currentUser));
      socket.emit("chat message", message);
      setMessage("");
      scrollToBottom();
      handleTyping(false);
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

  const handleTyping = (typing) => {
    socket.emit("typing", { user: currentUser, typing });

    // Eliminar el mensaje de escritura después de 3 segundos si el usuario no está escribiendo
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (typing) {
      typingTimeout.current = setTimeout(() => {
        socket.emit("typing", { user: currentUser, typing: false });
      }, 3000);
    }
  };

  const getUserIcon = (userName) => {
    if (userIcons.current[userName]) {
      return userIcons.current[userName];
    } else {
      const randomIcon = getRandomIcon();
      userIcons.current[userName] = randomIcon;
      localStorage.setItem("userIcons", JSON.stringify(userIcons.current));
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
        <div className="messages" ref={messagesEndRef}>
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

          {Object.keys(isTyping).map((user) => (
            <div key={user} className="is-typing">
              <div>{`${user} está escribiendo un mensaje...`}</div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="message-input-container">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key !== "Enter") {
                  handleTyping(true);
                }
              }}
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

// const socket = io("https://chatwebapp-p1px.onrender.com");

// const ChatRoom = () => {
//   const dispatch = useDispatch();
//   const personalChats = useSelector((state) => state.personalChats);
//   const users = useSelector((state) => state.users);
//   const currentUser = useSelector((state) => state.currentUser);
//   const [message, setMessage] = useState("");
//   const [isTyping, setIsTyping] = useState({});
//   const [userIcons, setUserIcons] = useState({});
//   const messagesEndRef = useRef(null);
//   let typingTimeout;

//   useEffect(() => {
//     if (currentUser) {
//       dispatch(getPersonalChats(currentUser));
//       dispatch(getAllUsers());
//     }
//   }, [currentUser, dispatch]);

//   useEffect(() => {
//     socket.on("chat message", (newMessage) => {
//       if (currentUser) {
//         dispatch(getPersonalChats(currentUser));
//         scrollToBottom();
//       }
//     });
//   }, [currentUser, dispatch]);

//   useEffect(() => {
//     const storedUserIcons = JSON.parse(localStorage.getItem("userIcons")) || {};
//     setUserIcons(storedUserIcons);
//   }, []);

//   useEffect(() => {
//     socket.on("typing", (data) => {
//       setIsTyping(data);
//     });
//   }, []);

//   const handleTyping = (typing) => {
//     socket.emit("typing", { user: currentUser, typing });
//   };

//   const handleSendMessage = () => {
//     if (currentUser && message) {
//       dispatch(createPersonalChat(message, currentUser));
//       socket.emit("chat message", message);
//       setMessage("");
//       scrollToBottom();
//       handleTyping(false); // El usuario deja de escribir después de enviar el mensaje.
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
//       <div className="messages" ref={messagesEndRef}>
//   {personalChats.map((chat, index) => (
//     <div key={index} className="message">
//       <span className="sender">
//         <FontAwesomeIcon
//           icon={getUserIcon(chat.userNameSend)}
//           size="lg"
//         />
//         {chat.userNameSend}:
//       </span>
//       <span className="message-text">{chat.message}</span>
//       <span className="createdAt">{chat.createdAt}</span>
//     </div>
//   ))}
//   {Object.keys(isTyping).length > 0 && (
//     <div className="is-typing">
//       {Object.keys(isTyping).map((user) => (
//         <div key={user}>{`${isTyping.user} está escribiendo un mensaje...`}</div>
//       ))}
//     </div>
//   )}
// </div>


//         <form onSubmit={(e) => e.preventDefault()}>
//           <div className="message-input-container">
//             <input
//               type="text"
//               placeholder="Escribe un mensaje..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key !== "Enter") {
//                   handleTyping(true);
//                   clearTimeout(typingTimeout);
//                   typingTimeout = setTimeout(() => handleTyping(false), 2000);
//                 }
//               }}
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




