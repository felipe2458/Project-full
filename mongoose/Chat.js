const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    users: [{ type: String, required: true }],
    messages: [{ type: mongoose.Schema.Types.Mixed, required: true }],
}, { collection: 'Chat' });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;