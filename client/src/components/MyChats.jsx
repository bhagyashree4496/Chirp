import React, { useEffect, useState } from "react";
import { GetAllChats } from "../api/api";
import { useUser } from "../context/UserContext";

function MyChats() {
  const { user, chats, setChats, selectedChat, setSelectedChat } = useUser();
  const fetchAllChats = async () => {
    const data = await GetAllChats(user?.token);
    console.log(data);
    setChats(data);
  };
  useEffect(() => {
    fetchAllChats();
  }, []);
  return (
    <div
      className={`flex-1 flex flex-col p-4 bg-gray-800 rounded-md ${
        selectedChat && "hidden invisible md:visible md:flex"
      } my-[10px]`}
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Chats</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            document.getElementById("my_modal_groupchat-add").showModal();
            setSelectedChat(null);
          }}
        >
          + New Group Chat
        </button>
      </div>

      {/* Search Bar */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="input input-bordered w-full"
        />
      </div> */}

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto ">
        {chats?.length ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              key={chat._id}
              className={`flex items-center justify-between p-3 mb-2 bg-gray-700 ${
                selectedChat?._id === chat._id && "bg-primary text-white"
              } rounded-lg shadow hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-center ">
                {/* Avatar */}
                <div>
                  <div className="w-12 h-12 rounded-full  ">
                    <img
                      className="rounded-full"
                      src={`https://ui-avatars.com/api/?name=${chat.chatName}`}
                      alt="avatar"
                    />
                  </div>
                </div>

                {/* Chat Info */}
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    {chat.isGroupChat
                      ? chat.chatName
                      : chat.users.find((u) => u._id !== user._id).name}
                  </h2>
                  <p className="text-sm text-gray-500 truncate w-40">
                    {chat?.latestMessage?.content}
                  </p>
                </div>
              </div>

              {/* Time & Unread Messages */}
              <div className="text-right">
                <p className="text-sm text-gray-400">{chat?.time}11:23</p>
                {/* {chat.unread > 0 && (
                <span className="badge badge-primary">{chat.unread}</span>
              )} */}
              </div>
            </div>
          ))
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
}

export default MyChats;
