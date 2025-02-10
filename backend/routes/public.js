import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res)=>{
    try{
        const user = req.body;
        const userExists = await prisma.user.findUnique({ where: { username: user.username } })

        if(userExists){
            return res.status(400).json({message: "Usuário já cadastrado"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt)

        const userDb = await prisma.user.create({
            data: {
                username: user.username,
                password: hashPassword
            }
        })

        return res.status(201).json(userDb)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Erro ao cadastrar"})
    }
})

router.post('/login', async (req, res)=>{
    try{
        const userInfo = req.body;

        const user = await prisma.user.findUnique({ where: { username: userInfo.username } })
        
        if(!user){
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "Senha incorreta"})
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json(token)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Erro ao logar"})
    }
})

export default router;