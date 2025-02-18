import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'
import mongoose from 'mongoose'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

mongoose.connect(databaseUrl ).then(() => console.log("Conectado com sucesso ao banco de dados")).catch(err => console.log("Ouve um erro", err) );

app.use(express.json());
app.use(cors('http://localhost:4200'));

app.use('/', publicRoutes);
app.use('/', auth, privateRoutes);

app.listen(3090, ()=>{
    console.log(`Server is running on port ${port}`)
})