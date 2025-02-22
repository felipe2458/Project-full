import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../DB/User.js'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res)=>{
    try{
        const user = req.body;
        const userExists = await User.findOne({ username: user.username.trim() });

        if(userExists){
            return res.status(400).json({message: "Usuário já cadastrado"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt)


        User.create({
            _id: new mongoose.Types.ObjectId(),
            username: user.username.trim(),
            password: hashPassword,
            chat: [],
            friendRequests: {
                pending: {
                    sentTo: [],
                    receivedFrom: []
                },
                accepted: []
            }
        })

        return res.status(201).json({ message: "Cadastro realizado com sucesso" })
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Erro ao cadastrar"})
    }
})

router.post('/login', async (req, res)=>{
    try{
        const userInfo = req.body;

        const user = await User.findOne({ username: userInfo.username });
        
        if(!user){
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "Senha incorreta"})
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
        req.token = token;

        res.status(200).json(token)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Erro ao logar"})
    }
})

router.get('/users', async (req, res)=>{
    try{
        const users = await User.find().select("username");

        return res.json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Erro ao buscar usuários"})
    }
})

export default router;