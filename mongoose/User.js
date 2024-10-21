const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: String,
    name: String,
    password: String,
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);

module.exports = User;