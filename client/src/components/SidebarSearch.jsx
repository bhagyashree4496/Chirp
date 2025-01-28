import React, { useState } from "react";
import { LuUserRoundSearch } from "react-icons/lu";
import { CreateChat, GetUsersApi } from "../api/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function SidebarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searrcResults, setSearrcResults] = useState(null); //

  const { user, chats, setChats, setSelectedChat } = useUser();
  const handleGetUsers = async () => {
    if (searchTerm) {
      setLoading(true);
      const SearcRes = await GetUsersApi(searchTerm, user?.token);
      setSearrcResults(SearcRes);
      setLoading(false);
    } else {
      toast.success("Please enter name or email to search");
    }
  };
  const CreteAChat = async (id) => {
    const res = await CreateChat(id, user?.token);
    console.log(res);
    setChats(
      chats.find((chat) => chat._id === res._id) ? [...chats] : [...chats, res]
    );
    setSelectedChat(res);
  };
  return (
    <div className="drawer w-auto z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-primary  drawer-button">
          <LuUserRoundSearch />
          <span className="hidden md:block">Search User</span>
        </label>
      </div>
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className="p-2 bg-primary text-white rounded-full cursor-pointer"
              onClick={handleGetUsers}
            >
              GO
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg> */}
            </div>
          </label>
          {searrcResults !== null && (
            <div className="space-y-2 mt-4">
              {searrcResults?.length > 0
                ? searrcResults?.map((res) => {
                    return (
                      <>
                        {loading ? (
                          <div className="skeleton h-16 w-full"></div>
                        ) : (
                          <div
                            onClick={() => {
                              CreteAChat(res._id);
                              document.getElementById(
                                "my-drawer"
                              ).checked = false;
                            }}
                            key={res._id}
                            className="flex items-center p-2  rounded-lg shadow-sm hover:shadow-lg cursor-pointer"
                          >
                            {/* Profile Picture */}
                            <img
                              //src={user.pic}
                              src={res.pic}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover mr-4"
                            />
                            {/* Name */}
                            <div>
                              <h3 className="text-sm font-semibold">
                                {res.name}
                              </h3>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })
                : [0, 0, 0].map((res) => (
                    <div className="flex w-52 flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="skeleton h-14 w-16 shrink-0 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                          <div className="skeleton h-4 w-20"></div>
                          <div className="skeleton h-4 w-28"></div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SidebarSearch;
