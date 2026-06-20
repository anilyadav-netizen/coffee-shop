const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    amiunt: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },

})

const User = mongoose.model("User", UserSchema)

module.exports = User