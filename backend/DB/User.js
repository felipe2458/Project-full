import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    chat: [{ userID: String, messages: [{
        messages: [{
            time: { type: Date, default: Date.now },
            message: { type: String },
            from: { type: String }
        }]
    }] }],
    friendRequests: { 
        pending: { 
            sentTo: [{ username: String }],
            receivedFrom: [{ username: String }]
         },
        accepted: [{ username: String }]
     }
}, { collection: 'User' })

const User = mongoose.model('User', userSchema);

export default User;