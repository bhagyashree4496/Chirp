import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create UserContext
const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notifications, setnotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("chirpuser"));
    console.log(stored);
    if (stored) {
      setUser(stored);
      navigate("/chats");
    }
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setnotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
