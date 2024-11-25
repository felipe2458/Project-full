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
const router = require('./router/routers')(io);
const background = require('./router/config/background');

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

app.get('/', async (req, res)=>{
    if(req.cookies.username){
        req.session.user = req.cookies.username;

        const user = await User.findOne({ name: req.session.user });

        const background_val = user.background[0].darkmode ? background[0].darkmode.home : background[0].lightmode.home

        return res.render('home.ejs', { username: req.session.user, logado: true, background_val });
    }else{
        return res.render('home.ejs', { logado: false, background_val: background.lightmode.home });
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
                friends: [],
                icon: { data: null, contentType: null },
                background: [{ darkmode: false }],
            }).then(()=>{
                return res.redirect('/login');
            }).catch(err =>{
                console.error('Erro ao cadastrar usuário:', err);
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

const players = new Map();

io.on('connection', (socket) => {
    socket.on('send_message', async (data)=>{
        io.emit('receive_message', data);

        const { username, friend, message, time, day } = data;

        const user = await User.findOne({ name: username });
        const friend_chat = await User.findOne({ name: friend });
        const chat_user = await user.chats.find(chat => chat.users.includes(username) && chat.users.includes(friend));
        const chat_friend = await friend_chat.chats.find(chat => chat.users.includes(friend) && chat.users.includes(username));

        chat_user.messages.push({ messageFrom: username, message, time, day });
        chat_friend.messages.push({ messageFrom: username, message, time, day });

        user.save();
        friend_chat.save();
    })

    socket.on('player_connected', (data)=>{
        if(!Array.from(players.values()).includes(data)){
            players.set(socket.id, data);
        }

        io.emit('verificar_player', Array.from(players.values()));
    });

    socket.on('disconnect', ()=>{
        const disconnect_player = players.get(socket.id);

        if(disconnect_player){
            players.delete(socket.id);
        }

        io.emit('verificar_player', Array.from(players.values()));
    })
});

app.use('/:user', router);

app.use(function(req, res, next){
    res.render('page404.ejs');
});

server.listen(3090, ()=>{
    console.log('O servidor está rodando na porta 3090!');
});