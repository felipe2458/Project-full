const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const socketIo = require('socket.io');
const io = socketIo(server);

const User = require('./mongoose/User');
const Chat = require('./mongoose/Chat');
const router = require('./router/routers')(io);

mongoose.connect('mongodb+srv://root:q8n7MKjqbgluikbZ@cluster0.zsdig.mongodb.net/Project-full?retryWrites=true&w=majority&appName=Cluster0', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Conectado com sucesso ao MongoDB");
}).catch((err)=>{
    console.log(err.message);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '124578963369784512',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: null,
    }
}));

app.use(cookieParser());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'src/public')));
app.set('views', path.join(__dirname, 'src/pages'));

app.get('/', (req, res)=>{
    if(req.cookies.username){
        req.session.user = req.cookies.username;

        return res.render('home.ejs', { logado: true, username: req.session.user });
    }else{
        return res.render('home.ejs', { logado: false });
    }
});

app.get('/register', (req, res)=>{
    res.render('register_user.ejs');
});

app.post('/register', async function(req, res){
    try{
        if(await User.findOne({name: req.body.name.trim()})){
            return res.redirect('/register');
        }else{
            const pass = await bcrypt.hash(req.body.password, 10);

            User.create({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name.trim(),
                password: pass,
                icon: false,
                socketId: null,
            }).then(()=>{
                return res.redirect('/login');
            }).catch(err =>{
                return res.redirect('/register');
            });
        }
    }catch{
        res.status(500).send();
    };
});

app.get('/login', (req, res)=>{
    res.render('login.ejs');
});

app.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({
            name: req.body.name_login.trim()
        });

        if(await !user){
            return res.redirect('/login');
        }

        if(await bcrypt.compare(req.body.password_login.trim(), user.password)){
            const remember = req.body.remember === 'on';

            if(await remember){
                res.cookie('username', req.body.name_login.trim(),{
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax'
                });

                req.session.user = req.body.name_login.trim();

                return res.redirect(`${req.session.user.split('_').join('-')}/home`);

            }else{
                const userCookie = await req.cookies.username;

                if(await userCookie){
                    res.clearCookie('username',{
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax'
                    });
                }

                req.session.user = user.name;

                return res.redirect(`/${user.name.split('_').join('-')}/home`);
            }
        }else{
            return res.redirect('/login');
        }
    }catch(err){
        console.log('Erro ao validar login:', err);
        return res.status(500).send('Erro ao validar login. Tente novamente. <a href="/">Voltar</a>');
    }
});

app.use('/:user', router);

io.on('connection', (socket) => {
    socket.on('login', async (data)=>{
        const { name, password, socketId } = data;

        try{
            const user = await User.findOne({ name });

            if(user && await bcrypt.compare(password, user.password)){
                if(!user.socketId){
                    user.socketId = socketId;
                    await user.save();
                }
            }else{
                socket.emit('login-erro', { message: 'Usuário ou senha inválidos.' });
            }
        }catch(err){
            console.error('Erro ao validar login:', err);
            socket.emit('login-erro', { message: 'Erro ao validar login. Tente novamente.' });
        }
    });

    socket.on('send_message', (data)=>{
        io.emit('receive_message', data);

        const { username, friend, message, time, day } = data;

        Chat.findOne({ users: { $in: [username, friend] } }).then((result)=>{
            if(!result){
                const newChat = new Chat({
                    _id: new mongoose.Types.ObjectId(),
                    users: [username, friend],
                    messages: [{ messageFrom: username, message, time, day }]
                });

                newChat.save();
                return
            }else{
                result.messages.push({ messageFrom: username, message, time, day });
                result.save();
            }
        }).catch((err)=>{
            console.error('Erro ao buscar chat:', err);
        });
    })
});

app.use(function(req, res, next){
    res.status(404).send('Esta página não existe!');
});

server.listen(3090, ()=>{
    console.log('O servidor está rodando na porta 3090!');
});