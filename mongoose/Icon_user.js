const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    fileExtension: { type: String, required: true },
    imageName: { type: String, required: true },
}, {collection: 'photo_icon_user'});

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;