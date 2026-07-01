const express = require("express")
const { protect } = require("../middlewares/authmiddleware");
const { sendMessage, allMessage, markMessagesAsRead } = require("../controllers/messageControllers");

const messageRouters = express.Router()

messageRouters.post('/', protect, sendMessage);
messageRouters.post('/read/:chatId', protect, markMessagesAsRead);
messageRouters.get('/:chatId', protect, allMessage);

module.exports = messageRouters
