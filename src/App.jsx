import { Routes, Route } from "react-router-dom";

import ChatRoom from "./components/Chat/ChatRooms";
import Login from "./components/Chat/Login";

function App() {
  return (
    <div>
      <h1>Chat de Usuarios</h1>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
