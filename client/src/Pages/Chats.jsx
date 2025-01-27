import React, { useEffect, useState } from "react";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";
import SidebarSearch from "../components/SidebarSearch";
import { FaRegUser } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AddGroupModal from "../components/AddGroupModal";
import EditGroupModal from "../components/EditGroupModal";
import bgimg1 from "../assets/bgimg2.jpg";
function Chats() {
  const { user, setSelectedChat, notifications, setnotifications } = useUser();
  const [notifNumb, setNotifNumb] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setNotifNumb(notifications.length);
  }, [notifications]);
  const handlelogout = () => {
    localStorage.removeItem("chirpuser");
    navigate("/");
  };
  return (
    <div
      className="w-screen h-screen  bg-repeat bg-center"
      style={{ backgroundImage: `url(${bgimg1})` }}
    >
      <div className="h-20 w-screen sticky top-0 flex  items-center px-8 bg-gray-800">
        <SidebarSearch />
        <h1 className="flex-1 text-center text-primary font-bold text-3xl">
          Chirp
        </h1>
        <div className="flex items-center ">
          <div className="dropdown dropdown-end">
            <div className="indicator">
              {notifNumb > 0 && (
                <span className="indicator-item badge badge-primary">
                  {notifNumb}
                </span>
              )}
              <div
                tabIndex={0}
                role="button"
                className="rounded-full bg-black  btn "
              >
                <IoIosNotifications />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-[30vw] p-4 shadow"
            >
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <li
                    className="
                  cursor-pointer"
                    onClick={() => {
                      setSelectedChat(n.chat);
                      const temp = notifications.filter(
                        (not) => not._id !== n._id
                      );
                      setnotifications([...temp]);
                    }}
                  >
                    New massage from{" "}
                    {n.chat.isGroupChat ? n.chat.chatName : n.sender.name}
                  </li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              <FaRegUser />
              <MdArrowDropDown />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li
                onClick={() =>
                  document.getElementById("my_modal_profile").showModal()
                }
              >
                <a>My Profile</a>
              </li>
              <li onClick={handlelogout}>
                <a>Log out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4 z-0 px-2 h-[80vh]">
        <MyChats />

        <Chatbox />
      </div>
      <dialog
        id="my_modal_profile"
        className="modal modal-bottom sm:modal-middle w-screen h-screen"
      >
        <div className="modal-box flex flex-col items-center space-y-3">
          <h3 className="font-bold text-lg">{user?.name}</h3>
          <div className="avatar online">
            <div className="w-24 rounded-full">
              <img src={user?.pic} />
            </div>
          </div>
          <div>{user?.email}</div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <AddGroupModal />
      <EditGroupModal />
    </div>
  );
}

export default Chats;
