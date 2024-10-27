const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    _id: String,
    username: String,
    fileExtension: String,
    imageName: String,
}, {collection: 'photo_icon_user'});

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;