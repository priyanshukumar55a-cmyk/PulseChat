const express = require("express")
const { protect } = require("../middlewares/authmiddleware");
const { sendMessage, allMessage } = require("../controllers/messageControllers");

const messageRouters = express.Router()

messageRouters.post('/', protect, sendMessage);
messageRouters.get('/:chatId', protect, allMessage);

module.exports = messageRouters
