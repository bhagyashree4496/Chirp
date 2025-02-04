const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserChat" },
    content: { type: String, trim: true },

    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserChat" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
