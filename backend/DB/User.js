import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'User' })

const User = mongoose.model('User', userSchema);

export default User;