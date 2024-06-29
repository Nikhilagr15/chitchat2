const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.sendStatus(400);
    }
    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")
    if (isChat.length) {
        const chat = isChat
        res.send(chat)
    } else {
        const chatObj = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, req.user._id],
        };
        try {
            const chat = await Chat.create(chatObj);
            const chatData = await Chat.find({ _id: chat._id }).populate("users", "-password").populate("latestMessage");
            res.send(chatData);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        res.send(chats);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const groupChatCreate = (async (req, res) => {
    const { users, chatName } = req.body;
    if (!users || !chatName) {
        res.status(400);
        throw new Error("Provide all required fields.")
    }
    
    try {
        users_arr = JSON.parse(users)
        const chats = await Chat.create({
            chatName: chatName,
            isGroupChat: true,
            users: [...users_arr, req.user._id],
            groupAdmin: req.user._id
        })
        const chats_obj = await Chat.findOne({ _id: chats._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.send(chats_obj)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})
module.exports = { accessChat, fetchChats, groupChatCreate };