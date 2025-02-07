import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

export const gerarToken = (user)=>{
    jwt.sign({ id: user._id }, secret, { expiresIn: '24h' })
}