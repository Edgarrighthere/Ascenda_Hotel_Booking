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
import InputOTP from "./pages/authentication/InputOTP";
import ForgotPwd from "./pages/authentication/ForgotPwd";
import ResetPwd from "./pages/authentication/ResetPwd";
import Confirmation from "./pages/confirmation/Confirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels/:destinationId/:checkin/:checkout/:guests/:page" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/inputOTP" element={<InputOTP/>}/>
        <Route path="/forgotPassword" element={<ForgotPwd/>}/>
        <Route path="/resetPassword/:token" element={<ResetPwd/>}/>
        <Route path="/cancel" element={<Hotel/>}/>
        <Route path="/complete/:session_id" element={<Confirmation/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
