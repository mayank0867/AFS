const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    OTP:{
        required: true,
        type: Number
    },
    Verify:{
        type: Boolean,
        default: false
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = User;