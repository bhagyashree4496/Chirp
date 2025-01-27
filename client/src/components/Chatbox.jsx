import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { BsArrowLeft, BsThreeDotsVertical } from "react-icons/bs";
import { CreateMessage, GetAllMessages } from "../api/api";
import { io } from "socket.io-client";

let socket = null,
  selectedChatCompare = null;

function Chatbox() {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setnotifications,
  } = useUser();
  const [messages, setMessages] = useState([]);
  const [msgparam, setmsgparam] = useState("");
  const [Loading, setloading] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);

  const messagesEndRef = useRef(null); // Ref for the last message

  useEffect(() => {
    const socket = io("https://chirp-wcpc.onrender.com", {
      transports: ["websocket", "polling"],
    });

    console.log("Socket initialized:", socket);
    socket.emit("setup", user);
    socket.on("collection", () => {
      console.log("Socket connected");
      setsocketConnected(true);
    });
  }, []);

  const fetchmessages = async () => {
    setloading(true);
    if (selectedChat) {
      const res = await GetAllMessages(selectedChat?._id, user.token);
      setMessages(res);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
    }
  };

  useEffect(() => {
    fetchmessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const messageListener = (newmessagerecieved) => {
      console.log(newmessagerecieved);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newmessagerecieved.chat?._id
      ) {
        const isExists = notifications.find(
          (n) => n.chat._id === newmessagerecieved.chat?._id
        );
        if (!isExists) {
          setnotifications([...notifications, newmessagerecieved]);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newmessagerecieved]);
      }
    };
    socket.on("message recieved", messageListener);
    return () => {
      socket.off("message received", messageListener);
    };
  }, []);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendmessage = async (e) => {
    if (e.key === "Enter" && msgparam) {
      const res = await CreateMessage(msgparam, selectedChat._id, user.token);
      console.log(res);
      socket.emit("new message", res);
      setMessages([...messages, res]);
      setmsgparam("");
    }
  };

  return (
    <div
      className={`flex-[2] bg-gray-800 rounded-md ${
        !selectedChat && "hidden invisible md:visible md:block"
      } my-[10px]`}
      style={{ height: "calc(100vh - 100px)" }}
    >
      {selectedChat ? (
        <div className="h-full flex flex-col">
          <div
            className={`flex items-center justify-between p-3 mb-2  bg-primary text-white shadow hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-center">
              <button
                className="btn btn-circle mr-3 md:hidden"
                onClick={() => {
                  setSelectedChat(null);
                }}
              >
                <BsArrowLeft />
              </button>

              <div className=" ">
                <div className="w-12 h-12  ">
                  <img
                    className="rounded-full"
                    src={`https://ui-avatars.com/api/?name=${selectedChat.chatName}`}
                    alt="avatar"
                  />
                </div>
              </div>

              <div className="ml-4">
                <h2 className="text-lg font-semibold">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : selectedChat?.users.find((u) => u._id !== user._id).name}
                </h2>
              </div>
            </div>
            {selectedChat.isGroupChat && (
              <div>
                <button
                  className="btn btn-circle"
                  onClick={() => {
                    document
                      .getElementById("my_modal_groupchat_edit")
                      .showModal();
                  }}
                >
                  <BsThreeDotsVertical />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {Loading
              ? Array(10)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className="flex w-52 flex-col gap-4 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                          <div className="skeleton h-4 w-20"></div>
                          <div className="skeleton h-4 w-28"></div>
                        </div>
                      </div>
                    </div>
                  ))
              : messages?.map((message) => (
                  <div
                    key={message._id}
                    className={`chat ${
                      message.sender._id === user._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Avatar"
                          src={`https://ui-avatars.com/api/?name=${message.sender.name}`}
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      {message.sender.name}
                      <time className="text-xs opacity-50">12:46</time>
                    </div>
                    <div className="chat-bubble">{message.content}</div>
                  </div>
                ))}
            <div ref={messagesEndRef}></div> {/* Scroll target */}
          </div>

          <div
            className=""
            onKeyDown={(e) => {
              sendmessage(e);
            }}
          >
            <input
              type="text"
              onChange={(e) => setmsgparam(e.target.value)}
              value={msgparam}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
        </div>
      ) : (
        <h1 className="flex items-center justify-center text-primary text-lg h-full">
          Start Chatting at Chirp
        </h1>
      )}
    </div>
  );
}

export default Chatbox;
