import express from 'express';
import dotenv from 'dotenv';
import routerProtect from './src/routes/routerProtect.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api', routerProtect);

app.post('/register', (req, res) => {
    const teste = req.body;
    console.log(teste);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});