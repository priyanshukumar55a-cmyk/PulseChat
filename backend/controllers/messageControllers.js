const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        res.status(400)
        throw new Error("Invalid data passed into request")
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender","username pic" )
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'username pic email',
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.json(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

module.exports = {sendMessage}