import express from 'express';
import dotenv from 'dotenv';
import routerProtect from './src/routes/routerProtect.js';
import { gerarToken } from './src/middlewares/authController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routerProtect);

app.post('/login', (req, res)=>{
    
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});