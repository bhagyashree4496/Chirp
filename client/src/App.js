import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";
import { ToastContainer } from "react-toastify";
import { useUser } from "./context/UserContext";

const App = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        {user && <Route path="/chats" element={<Chats />} />}
      </Routes>
    </div>
  );
};

export default App;
