const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String, default: "https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_960_720.png" },
},
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userModel)

module.exports = User
