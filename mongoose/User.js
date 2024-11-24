const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: String, required: true }],
    icon: [{
        data: { type: Buffer, required: false },
        contentType: { type: String, required: false }
    }],
    background: [{
        darkmode: { type: Boolean, required: true }
    }],
    chats: [{
        users: [{ type: String, required: false }],
        messages: [{
            messageFrom: { type: String, required: false },
            message: { type: String, required: false },
            time: { type: String, required: false },
            day: { type: String, required: false }
        }]
    }]
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;