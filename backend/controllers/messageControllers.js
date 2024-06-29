const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const getChatMessages = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({
            chat: chatId
        })
            .populate('sender', '-password')
        res.send(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        res.status(400);
        throw new Error("Content and chatId are required.")
    }
    try {

        const newMessage = {
            chat: chatId,
            content: content,
            sender: req.user._id
        }

        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'name profile email')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name profile email'
        })
        await Chat.findOneAndUpdate(
            { _id: chatId },
            { latestMessage: message._id }
        )
        res.send(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

module.exports = { getChatMessages, sendMessage };