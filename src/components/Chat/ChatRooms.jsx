import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  
  fetchUsers,
  sendMessage,
  fetchChats,
} from "../Redux/actions";
import { IoMdSend, IoMdEye, IoMdEyeOff } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import "../Chat/ChatRooms.css";

// const socket = io("http://localhost:3001");
 const socket = io("https://chatwebapp-p1px.onrender.com")

const ChatRoom = () => {
  const dispatch = useDispatch();
  const personalChats = useSelector((state) => state.chats);
  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState({});
  const [showUserList, setShowUserList] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  console.log("mensaje desde chatroom", message);

  useEffect(() => {
    console.log("ChatRoom component mounted");
    if (currentUser) {
      dispatch(fetchChats(currentUser));
      dispatch(fetchUsers());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    socket.on("chat message", (newMessage) => {
      console.log("Received new message:", newMessage);

      console.log("Fetching chats after receiving a new message.");
      dispatch(fetchChats(currentUser));
      scrollToBottom();
    });

    return () => {
      socket.off("chat message");
      console.log("Personal Chats:", personalChats);
    };
  }, [currentUser, dispatch, personalChats]);

  useEffect(() => {
    socket.on("typing", (data) => {
      console.log("Received typing event:", data);
      setIsTyping((prevIsTyping) => ({
        ...prevIsTyping,
        [data.user]: data.isTyping,
      }));
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log("Personal Chats after fetching:", personalChats);
  }, [personalChats]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      console.log("Scrolling to bottom at:", new Date().toLocaleTimeString());
    }
    console.log("Personal Chats after fetching:", personalChats);
  }, [personalChats]);

  const scrollToBottom = () => {
    console.log("Before scrolling:", messagesEndRef.current.scrollTop);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
    console.log("After scrolling:", messagesEndRef.current.scrollTop);
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

  const handleSendMessage = async () => {
    if (currentUser && message) {
      const emojiText = message;
      await dispatch(sendMessage(currentUser, emojiText));
      socket.emit("chat message", { user: currentUser, message: emojiText });
      setMessage("");
      console.log("Before scrolling in handleSendMessage");
      scrollToBottom();
      console.log("After scrolling in handleSendMessage");
      handleTyping(false);
      console.log("personalChats después de sendMessage:", personalChats);
    }
  };

  return (
    <>
      <h1 className="text-center mt-3 mb-1 welcome">
        Bienvenid@: {currentUser}
      </h1>

      <div className="container">
        <div className="row">
          {showUserList && (
            <div className="col-md-3 user-list">
              <h3 className="users-conect-list">Usuarios conectados:</h3>
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
            <div className="text-end mt-3">
              {showUserList ? (
                <Link className="btn " onClick={() => setShowUserList(false)}>
                  <IoMdEye />
                </Link>
              ) : (
                <Link className="" onClick={() => setShowUserList(true)}>
                  <IoMdEyeOff />
                </Link>
              )}
            </div>
            <div className="messages" ref={messagesEndRef}>
              {console.log("Personal Chats al principio:", personalChats)};
              {personalChats.map((chat, index) => {
                const isCurrentUser = chat.userNameSend === currentUser;
                const messageClass = isCurrentUser
                  ? "user-message"
                  : "other-message";

                return (
                  <div key={index} className={`message ${messageClass}`}>
                    <span className="sender">{chat.userNameSend}:</span>
                    <span className="message-text">{chat.message}</span>
                    <span className="createdAt">{chat.createdAt}</span>
                  </div>
                );
              })}
              {console.log("Personal Chats al final:", personalChats)}
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
                  <IoMdSend />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
