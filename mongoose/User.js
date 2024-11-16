const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    icon: { type: Boolean, required: true },
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;