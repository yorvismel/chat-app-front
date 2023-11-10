import { Routes, Route } from "react-router-dom";
import ChatRoom from "./components/Chat/ChatRooms";
import Login from "./components/Chat/Login";
import { useSelector } from "react-redux";
import { Profiler } from "react";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const currentUser = useSelector((state) => state.currentUser);

  const callback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    console.log(`ID: ${id}, Phase: ${phase}, Duration: ${actualDuration},
    Base Duration: ${baseDuration}, Start Time: ${startTime}, Commit Time: ${commitTime}
    Interactions: ${interactions}`);
  };

  return (
    <div>
      <h1>Chat de Usuarios</h1>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/chat"
          element={
            <Profiler id="myProfiler" onRender={callback}>
              <ChatRoom currentUser={currentUser} />
            </Profiler>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
