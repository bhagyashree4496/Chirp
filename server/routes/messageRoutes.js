const express = require("express");
const {
  sendMessage,
  GetMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/create", sendMessage); // Create a new message
router.get("/:chatId", GetMessages);
module.exports = router;
