const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    _id: String,
    image: String
}, {collection: 'photo_icon_user'});

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;