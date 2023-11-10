import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createPersonalChat,
  getPersonalChats,
  getAllUsers,
} from "../Redux/actions";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "../Chat/ChatRooms.css"; 

// const socket = io("http://localhost:3001");
const socket = io("https://chatwebapp-p1px.onrender.com");

const ChatRoom = () => {
  const dispatch = useDispatch();
  const personalChats = useSelector((state) => state.personalChats);
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState({});
  const [showUserList, setShowUserList] = useState(true);
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
      setIsTyping((prevIsTyping) => ({
        ...prevIsTyping,
        [data.user]: data.isTyping,
      }));
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [personalChats]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (currentUser && message) {
      const emojiText = message;
      dispatch(createPersonalChat(emojiText, currentUser));
      socket.emit("chat message", emojiText);
      setMessage("");
      scrollToBottom();
      handleTyping(false);
    }
  };

  const handleTyping = useCallback(
    (typing) => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      const isTyping = Boolean(typing);
      setIsTyping((prevIsTyping) => ({
        ...prevIsTyping,
        [currentUser]: isTyping,
      }));

      socket.emit("typing", { user: currentUser, isTyping });

      if (isTyping) {
        typingTimeout.current = setTimeout(() => {
          socket.emit("typing", { user: currentUser, isTyping: false });
        }, 3000);
      }
    },
    [currentUser]
  );

  return (
    <>
      <h1 className="text-center mt-3 mb-1">Bienvenido {currentUser}</h1>
      <div className="container">
        <div className="row">
          {showUserList && (
            <div className="col-md-3 user-list">
              <h3>Usuarios en la sala:</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>{user.userName}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-md-9 conversation-container">
            <div className="prueba">
              {Object.keys(isTyping).map(
                (user) =>
                  user !== currentUser && (
                    <div key={user} className="is-typing">
                      {isTyping[user] && (
                        <h1 className="renderty">
                          {`${user} está escribiendo un mensaje nuevo...`}
                        </h1>
                      )}
                    </div>
                  )
              )}
            </div>
            <div className="messages" ref={messagesEndRef}>
              {personalChats.map((chat, index) => (
                <div key={index} className="message">
                  <span className="sender">{chat.userNameSend}:</span>
                  <span className="message-text">{chat.message}</span>
                  <span className="createdAt">{chat.createdAt}</span>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="message-input-container">
                <input
                  type="link"
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
                  onFocus={() => setShowEmojiPicker(false)}
                  className="form-control"
                />
                <Link
                  to="#"
                  className="emoji-button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  😄
                </Link>
                <div className="emoji-picker-react">
                  {showEmojiPicker && (
                    <EmojiPicker
                      onEmojiClick={(emoji) =>
                        setMessage((prev) => prev + emoji.emoji)
                      }
                    />
                  )}
                </div>
                <button
                  className="btn btn-primary send-button"
                  onClick={handleSendMessage}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="text-center mt-3">
          {showUserList ? (
            <button
              className="btn btn-secondary"
              onClick={() => setShowUserList(false)}
            >
              Ocultar Lista de Usuarios
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowUserList(true)}
            >
              Mostrar Lista de Usuarios
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
