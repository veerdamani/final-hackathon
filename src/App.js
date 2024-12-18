import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import Donate from "./component/Donate";
import Receive from "./component/Receive";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    </Router>
  );
}

export default App;