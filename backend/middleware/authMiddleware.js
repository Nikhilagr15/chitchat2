const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const auth = expressAsyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(user.id).select("-password");
            next();
        }
        catch (error) {
            throw new Error("Invalid authorization token.");
        }
    } else {
        throw new Error("Authorization token not provided.");
    }
})

module.exports = auth;