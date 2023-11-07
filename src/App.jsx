import { Routes, Route } from "react-router-dom";

import ChatRoom from "./components/Chat/ChatRooms";
import Login from "./components/Chat/Login";
import { useSelector } from "react-redux"; // Importa useSelector para obtener currentUser


function App() {
  // Obtiene el currentUser desde Redux
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div>
      <h1>Chat de Usuarios</h1>

      <Routes>
        <Route path="/" element={<Login />} />
        
        
        {/* Pasa currentUser como prop al componente ChatRoom */}
        <Route path="/chat" element={<ChatRoom currentUser={currentUser} />} />
        
      </Routes>
    </div>
  );
}

export default App;
