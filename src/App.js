import "./App.css";
import Apps from "./Components/App";
import { io } from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
function App() {
  const Socket = io("http://localhost:5000");
  console.log(Socket);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Apps socket={Socket} />} />
        <Route path="/:id" element={<Apps socket={Socket} />} />
        <Route path="/login" element={<Login socket={Socket} />} />
        <Route path="/signup" element={<Signup socket={Socket} />} />
      </Routes>
    </div>
  );
}

export default App;
