const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require('../config/generateToken');


const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password) {
        throw new Error("Please provide all required fields.")
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(404);
        throw new Error("User already exists!")
    }
    const user = await User.create({
        name, email, password, profile: profile ?? undefined
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("User creation error.")
    }
});

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw Error("Pleasr Provide all required fields.")
    }
    const user = await User.findOne({ email, password })
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error('Invelid Email or Password.')
    }
})

const getAllUsers = expressAsyncHandler(async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    console.log(req.user._id, req.query, { keyword });
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users);
})
module.exports = { registerUser, loginUser, getAllUsers };