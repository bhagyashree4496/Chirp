import React, { useEffect, useState } from "react";
import { CreateGroupChat, GetUsersApi, UpdateGrpName } from "../api/api";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

function AddGroupModal() {
  const { user, chats, setChats, selectedChat, setSelectedChat } = useUser();
  const [groupname, setgroupName] = useState("");
  const [groupuserquesry, setgroupuserquesry] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchusers, setsearchUsers] = useState([]);

  const handleSearchUsers = async () => {
    try {
      const res = await GetUsersApi(groupuserquesry, user?.token);
      setsearchUsers(res);
      setgroupuserquesry("");
    } catch (e) {
      toast(`No user called ${groupuserquesry} at Chirp`);
    }
  };
  const handleCreateGroup = async () => {
    const res = await CreateGroupChat(
      groupname,
      selectedUsers.map((u) => u._id),
      user?.token
    );
    setChats([res, ...chats]);
  };

  return (
    <dialog
      id="my_modal_groupchat-add"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box space-y-4">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg">Create Group Chat</h3>

        <input
          type="text"
          value={groupname}
          onChange={(e) => setgroupName(e.target.value)}
          placeholder="Enter Group Name"
          className="input input-bordered w-full grow"
        />
        <div className="space-x-2">
          {selectedUsers?.map((selu) => (
            <div className="badge badge-success gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              {selu.name}
            </div>
          ))}
        </div>
        <label className="input input-bordered flex items-center gap-2 pr-0">
          <input
            type="text"
            className="grow"
            onChange={(e) => setgroupuserquesry(e.target.value)}
            value={groupuserquesry}
            placeholder="Search users to add ex: john, jane"
          />
          <button
            fill="currentColor"
            className="btn  text-white  bg-primary"
            onClick={handleSearchUsers}
          >
            Go
          </button>
        </label>
        <div>
          {searchusers?.map((res) => (
            <div
              onClick={() => {
                selectedUsers.find((user) => user._id === res._id)
                  ? toast.warn("User is already added")
                  : setSelectedUsers([...selectedUsers, res]);

                setsearchUsers([]);
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
                <h3 className="text-sm font-semibold">{res.name}</h3>
                <h3 className="text-sm font-semibold">{res?.email}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-action">
          <form method="dialog" className="space-x-4">
            <button
              className="btn bg-primary text-white"
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default AddGroupModal;
