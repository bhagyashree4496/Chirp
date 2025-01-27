const express = require("express");
const {
  registerUser,
  loginUser,
  allSearchUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/AuthMiddleware");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", protect, allSearchUsers);
module.exports = router;
