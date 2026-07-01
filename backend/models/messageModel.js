const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ chat: 1, createdAt: -1 });

messageSchema.index({
  chat: 1,
  sender: 1,
  readBy: 1,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
