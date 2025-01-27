const express = require("express");
const {
  CreateorGetChat,
  GetAllChats,
  createGroupChat,
  UpadateGroupName,
  AddUsersGroupChat,
  RemoveUsersGroupChat,
  DeleteGroupChat,
} = require("../controllers/chatController");

const router = express.Router();
router.get("/", GetAllChats);
router.post("/", CreateorGetChat);
router.post("/group", createGroupChat);
router.put("/grouprename", UpadateGroupName);
router.put("/groupremove", DeleteGroupChat);
router.put("/groupadduser", AddUsersGroupChat);
router.put("/groupremoveuser", RemoveUsersGroupChat);
module.exports = router;
