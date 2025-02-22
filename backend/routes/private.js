import express from "express";
import User from "../DB/User.js";

const router = express.Router();

router.get("/add-friend", async (req, res)=>{
    try{
        const users = await User.find({ username: { $regex: new RegExp(req.body.user, "i") }, _id: { $ne: req.userId } }).select("-password");

        return res.json(users);
    }catch(err){
        return res.status(404).send("erro ao buscar usuários")
    }
})

router.post("/send-friend-request", async (req, res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        const friend = await User.findOne({ username: req.body.friend }).select("-password");

        if(!user){
            return res.status(400).send("Usuário não encontrado")
        }

        if(!friend){
            return res.status(400).send("Ao adicionar amigo, o usuário não existe")
        }

        if(user.friendRequests.pending.sentTo.find(friend => friend.username === friend.username) || friend.friendRequests.pending.receivedFrom.find(user => user.username === user.username)){
            return res.status(400).send("Você já enviou um pedido de amizade para esse usuário")
        }

        user.friendRequests.pending.sentTo.push({ username: friend.username });
        friend.friendRequests.pending.receivedFrom.push({ username: user.username });

        await user.save();
        await friend.save();

        return res.status(200).send("Pedido de amizade enviado com sucesso")
    }catch(err){
        console.log(err)
        return res.status(400).send("Erro ao enviar pedido de amizade")
    }
})

router.post("/accept-friend", async (req, res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        const friend = await User.findOne({ username: req.body.friend }).select("-password");

        if(!user){
            return res.status(400).send("Usuário não encontrado")
        }
        
        if(!friend){
            return res.status(400).send("Amigo não encontrado")
        }

        const userFriendRequest = user.friendRequests;
        const friendFriendRequest = friend.friendRequests;

        const indexUser = userFriendRequest.pending.sentTo.findIndex(friend => friend.username === friend.username);
        const indexFriend = friendFriendRequest.pending.receivedFrom.findIndex(user => user.username === user.username);

        if(indexUser !== -1){
            userFriendRequest.pending.sentTo.splice(indexUser, 1);
        }

        if(indexFriend !== -1){
            friendFriendRequest.pending.receivedFrom.splice(indexFriend, 1);
        }

        if(!userFriendRequest.accepted.find(friend => friend.username === friend.username)){
            userFriendRequest.accepted.push({ username: friend.username });
        }

        if(!friendFriendRequest.accepted.find(user => user.username === user.username)){
            friendFriendRequest.accepted.push({ username: user.username });
        }

        await user.save();
        await friend.save();

        return res.status(200).json({ user, friend })
    }catch(err){
        console.log(err)
        return res.status(500).send("Erro ao aceitar amigo")
    }
})

router.post("/chat/:userId", async (req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        const friend = await User.findById(req.params.userId).select("-password");
        const friendChatUser = user.friends.find(friend => friend.userID === friend._id);
        const friendChatFriend = friend.friends.find(friend => friend.userID === user._id);

        const message = req.body.message;

        if(!user){
            return res.status(400).json({ message: "Erro!!" })
        }

        if(!friend){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        if(!friendChatUser){
            return res.status(400).json({ message: "Amigo não encontrado" })
        }

        if(!friendChatFriend){
            return res.status(400).json({ message: "Amigo não encontrado" })
        }

        return res.json(user);
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "Erro ao buscar usuário" })
    }
});

export default router;