import './App.css';
import {
  BrowserRouter, 
  Routes, 
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPwd from "./pages/authentication/ForgotPwd";
import ResetPwd from "./pages/authentication/ResetPwd";
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState();
  const [opt, setOTP] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotPassword" element={<ForgotPwd/>}/>
        <Route path="/resetPassword" element={<ResetPwd/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
