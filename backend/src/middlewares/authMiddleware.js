import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization?.split(' ')[1];

    if(token){
        return res.status(401).json({ erro: 'Acesso negado!' });
    }

    try{
        const decoded = jwt.verify(token, secret)
        req.user = decoded;
    }catch{
        res.status(401).json({ erro: 'Token inválido!' });
    }
}

export default authMiddleware;