// context API to solve the problem of prop drilling

import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);

  // when we created login and signu up we stored user info in local storage

  // so we need to check if there is any user info in local storage

  // if there is we need to set the user state to that user info

  // if there is no user info in local storage we need to redirect the user to login page

  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");

    if (user) {
      setUser(JSON.parse(user));
    } else {
      //history.go('/');
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, chats, selectedChat, setSelectedChat, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
