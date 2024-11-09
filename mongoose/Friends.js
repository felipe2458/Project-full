const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    username_logged_in: { type: String, required: true },
    Friends: [{ type: String, required: true }]
}, { collection: 'users_friends' });

const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = Friends;