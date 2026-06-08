const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const chatRoutes = express.Router();

chatRoutes.post('/', protect, accessChat)
chatRoutes.get('/', protect, fetchChats)

chatRoutes.post('/group', protect, createGroupChat)
chatRoutes.put('/rename', protect, renameGroup)

chatRoutes.put('/groupadd', protect, addToGroup)
chatRoutes.put('/groupremove', protect, removeFromGroup)

module.exports = chatRoutes;