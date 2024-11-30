const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: String, required: true }],
    icon: {
        data: { type: Buffer, required: false, default: null },
        contentType: { type: String, required: false, default: null }
    },
    background: [{
        darkmode: {
            isChecked: { type: Boolean, required: false, default: false },
            personalized: { type: Boolean, required: false, default: false },
            style: { type: String, required: false, default: () => 'one' },
        }
    }],
    chats: [{
        users: [{ type: String, required: false }],
        messages: [{
            messageFrom: { type: String, required: false },
            message_voice: {
                data: { type: Buffer, required: false, default: ''},
                contentType: { type: String, required: false, default: '' }
            },
            message: { type: String, required: false, default: '' },
            time: { type: String, required: false },
            day: { type: String, required: false }
        }]
    }]
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;