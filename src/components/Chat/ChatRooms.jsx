import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createPersonalChat,
  getPersonalChats,
  getAllUsers,
} from "../Redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRandomIcon } from "./icons";
import "../Chat/ChatRooms.css";
import io from "socket.io-client";

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
      console.log(
        `Evento de escritura recibido: Usuario ${data.user}, isTyping: ${data.isTyping}`
      );
      setIsTyping((prevIsTyping) => {
        console.log("Prev Is Typing:", prevIsTyping);
        return {
          ...prevIsTyping,
          [data.user]: data.isTyping,
        };
      });
    });
  }, []);

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

  const handleSendMessage = () => {
    if (currentUser && message) {
      dispatch(createPersonalChat(message, currentUser));
      socket.emit("chat message", message);
      setMessage("");
      scrollToBottom();
      handleTyping(false);
    }
  };

  const handleTyping = (typing) => {
    console.log(`Estado de escritura: ${typing}`);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    const isTyping = Boolean(typing);
    setIsTyping((prevIsTyping) => {
      console.log("Prev Is Typing:", prevIsTyping);
      return {
        ...prevIsTyping,
        [currentUser]: isTyping,
      };
    });

    // Emitir evento "typing" con el estado de escritura
    socket.emit("typing", { user: currentUser, isTyping });

    if (isTyping) {
      typingTimeout.current = setTimeout(() => {
        // Si el usuario deja de escribir después de un tiempo, enviar un evento "typing" con isTyping: false
        socket.emit("typing", { user: currentUser, isTyping: false });
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
    <>
      <h1>Bienvenido {currentUser}</h1>
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

            {Object.keys(isTyping).map((user) => {
              console.log(`user: ${user}, isTyping[user]: ${isTyping[user]}`);
              return (
                user !== currentUser && (
                  <div key={user} className="is-typing">
                    {isTyping[user] && (
                      <h1 className="renderty">
                        <div>{`${user} está escribiendo un mensaje nuevo...`}</div>
                      </h1>
                    )}
                  </div>
                )
              );
            })}
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
                    clearTimeout(typingTimeout.current);
                    typingTimeout.current = setTimeout(() => {
                      handleTyping(false);
                    }, 3000);
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
    </>
  );
};

export default ChatRoom;
