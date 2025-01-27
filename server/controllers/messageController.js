const express = require("express");

const Message = require("../models/messageModel"); // Path to your message model
const Chat = require("../models/chatModel"); // Path to your chat model

// Send a message

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required" });
  }

  try {
    // Create the new message
    const newMessage = await Message.create({
      sender: req.user.id, // Assuming req.user contains the authenticated user
      content,
      chat: chatId,
    });

    // Populate sender and chat fields for better response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email") // Customize fields to populate
      .populate({
        path: "chat",
        populate: {
          path: "users", // Populate the users field in the chat
          select: "name email", // Customize the fields for users
        },
      });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

const GetMessages = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) return;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar") // Populate sender details (add `avatar` if available)
      .populate("chat"); // Optionally populate chat details

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
module.exports = { sendMessage, GetMessages };
