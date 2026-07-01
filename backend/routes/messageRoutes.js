const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const {
  sendMessage,
  allMessage,
  markMessagesAsRead,
} = require("../controllers/messageControllers");

const messageRouters = express.Router();

messageRouters.post("/", protect, sendMessage);
messageRouters
  .route("/read/:chatId")
  .post(protect, markMessagesAsRead)
  .put(protect, markMessagesAsRead);
messageRouters.get("/:chatId", protect, allMessage);

module.exports = messageRouters;
