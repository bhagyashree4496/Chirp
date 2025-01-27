const { generateToken } = require("../config/GenerateToken");
const UserChat = require("../models/userModel");
const mongoose = require("mongoose");
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }
  const userExists = await UserChat.findOne({ email: email });
  if (userExists) {
    res.status(400).json({ message: "Email already exists" });
  } else {
    const user = await UserChat.create({
      name,
      email: email,
      password: password,
    });
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({ ...userObject, token: generateToken(user._id) });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }
  const userExists = await UserChat.findOne({ email: email });
  if (userExists) {
    if (password === userExists.password) {
      const userObject = userExists.toObject();
      delete userObject.password;
      res
        .status(200)
        .json({ ...userObject, token: generateToken(userExists._id) });
    }
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

const allSearchUsers = async (req, res) => {
  try {
    const query = req.query.search;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Convert `req.user.id` to a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const users = await UserChat.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: new mongoose.Types.ObjectId(req.user.id) } }, // Exclude the current user
            {
              $or: [
                { name: { $regex: query, $options: "i" } }, // Case-insensitive match for `name`
                { email: { $regex: query, $options: "i" } }, // Case-insensitive match for `email`
              ],
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          pic: 1,
        },
      },
    ]);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in allSearchUsers:", error.stack || error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { registerUser, loginUser, allSearchUsers };
