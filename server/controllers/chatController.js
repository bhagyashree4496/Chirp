const Chat = require("../models/chatModel");

const CreateorGetChat = async (req, res) => {
  const { otherUserId } = req.body; // ID of the user to chat with
  const userId = req.user._id; // Assuming userId is extracted from middleware

  if (!otherUserId) {
    return res.status(400).json({ message: "Other user ID is required." });
  }

  // Check if a chat already exists
  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [userId, otherUserId] }, // Both users should exist in the chat
  })
    .populate("users", "-password") // Populate user details (excluding password)
    .populate("latestMessage");

  if (existingChat) {
    return res.status(200).json(existingChat);
  }

  // Create a new chat
  const newChat = new Chat({
    chatName: "sender",
    isGroupChat: false,
    users: [userId, otherUserId],
  });

  const createdChat = await newChat.save();

  const fullChat = await Chat.findById(createdChat._id).populate(
    "users",
    "-password"
  );

  res.status(201).json(fullChat);
};
const GetAllChats = async (req, res) => {
  try {
    const userId = req.user.id; // Assume the middleware sets `req.user`

    // Find all chats where the user is a participant
    const chats = await Chat.find({ users: { $in: [userId] } })
      .populate("users", "name email pic") // Populate user details (name, email)
      .populate("groupAdmin", "name email") // Populate group admin details
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name email pic" }, // Populate sender details in latestMessage
      })
      .sort({ updatedAt: -1 }); // Sort chats by most recently updated

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: error.message });
  }
};
const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;

    // Check if users need to be parsed
    const parsedUsers = typeof users === "string" ? JSON.parse(users) : users;

    if (!name || !parsedUsers || parsedUsers.length < 2) {
      return res
        .status(400)
        .json({ message: "Group name and at least 2 users are required" });
    }

    parsedUsers.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: parsedUsers,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "name email")
      .populate("groupAdmin", "name email");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create group chat", error: error.message });
  }
};
const UpadateGroupName = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    // Validate input
    if (!chatId || !chatName) {
      return res
        .status(400)
        .json({ message: "Chat ID and new name are required" });
    }

    // Find and update the group chat name
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true } // Return the updated document
    )
      .populate("users", "name email") // Populate users
      .populate("groupAdmin", "name email"); // Populate group admin

    if (!updatedChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error renaming group:", error.message);
    res
      .status(500)
      .json({ message: "Failed to rename group", error: error.message });
  }
};
const AddUsersGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Validate input
    if (!chatId || !userId) {
      return res
        .status(400)
        .json({ message: "Chat ID and User ID are required" });
    }

    // Find the group chat and add the user
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } }, // Add user to 'users' array, avoiding duplicates
      { new: true } // Return the updated document
    )
      .populate("users", "name email") // Populate users
      .populate("groupAdmin", "name email"); // Populate group admin

    if (!updatedChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error adding user to group:", error.message);
    res
      .status(500)
      .json({ message: "Failed to add user to group", error: error.message });
  }
};
const RemoveUsersGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Validate input
    if (!chatId || !userId) {
      return res
        .status(400)
        .json({ message: "Chat ID and User ID are required" });
    }

    // Find the group chat and remove the user
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } }, // Remove user from 'users' array
      { new: true } // Return the updated document
    )
      .populate("users", "name email") // Populate users
      .populate("groupAdmin", "name email"); // Populate group admin

    if (!updatedChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error removing user from group:", error.message);
    res.status(500).json({
      message: "Failed to remove user from group",
      error: error.message,
    });
  }
};
const DeleteGroupChat = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Validate input
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    // Find the group chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    // Ensure only the group admin can delete the group
    if (chat.groupAdmin.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Only the group admin can delete the group" });
    }

    // Delete the group chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Group chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting group chat:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete group chat", error: error.message });
  }
};
module.exports = {
  CreateorGetChat,
  GetAllChats,
  createGroupChat,
  UpadateGroupName,
  AddUsersGroupChat,
  RemoveUsersGroupChat,
  DeleteGroupChat,
};
