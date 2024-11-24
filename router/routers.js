const router = require('express').Router({mergeParams: true});
const router_config = require('./router_config');

const User = require('../mongoose/User');

module.exports = (io)=>{
    router.get('/home', async (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            const userCookie = req.cookies.username;

            if(userCookie){
                req.session.user = userCookie;
            }

            const user = await User.findOne({ name: req.session.user });

            const base64Image =  user.icon[0].data ? user.icon[0].data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${user.icon[0].contentType};base64,${base64Image}` : null;

            return res.render('page_initial.ejs', { username: req.session.user, image: imageSrc });
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/configuracoes', async (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            const user = await User.findOne({ name: req.session.user });
            const base64Image =  user.icon[0].data ? user.icon[0].data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${user.icon[0].contentType};base64,${base64Image}` : false;

            return res.render('config_user.ejs', { username: req.session.user, image: imageSrc, background: user.background[0] });
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/chat', async (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            const users = await User.find({});
            const user = await User.findOne({ name: req.session.user });
            const friends = user.friends;

            let usersList = [];
            let friendsList = [];

            users.forEach(async (user) =>{
                let base64Image =  user.icon[0].data ? user.icon[0].data.toString('base64') : false;
                let imageSrc = base64Image ? `data:${user.icon[0].contentType};base64,${base64Image}` : false;

                usersList.push(user.name);

                if(friends.includes(user.name) ){
                    friendsList.push({
                        name: user.name,
                        image: imageSrc
                    })
                }
            });

            return res.render('chat.ejs', { username: req.session.user, usersList, friendsList });
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/chat/:friend', async (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            const user = await User.findOne({ name: req.session.user });
            const friend = await User.findOne({ name: req.params.friend.split('-').join('_') });
            let chat_ejs = await user.chats.find(chat => chat.users.includes(req.session.user) && chat.users.includes(friend.name));
            const chat_friend = await friend.chats.find(chat => chat.users.includes(req.session.user) && chat.users.includes(friend.name));

            const base64Image =  friend.icon[0].data ? friend.icon[0].data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${friend.icon[0].contentType};base64,${base64Image}` : false;

            if(!chat_ejs){
                user.chats.push({
                    users: [req.session.user, friend.name],
                    messages: []
                });

                user.save();
                chat_ejs = await user.chats.find(chat => chat.users.includes(req.session.user) && chat.users.includes(friend.name));
            }

            if(!chat_friend){                
                friend.chats.push({
                    users: [friend.name, req.session.user],
                    messages: []
                });

                friend.save();
            }

            return res.render('chat_with_user.ejs', { username: req.session.user, friend: friend.name, image: imageSrc, chat: chat_ejs.messages, usersChat: chat_ejs.users });
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/buscar-user', (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user && req.query.username){
            User.find({}).exec().then( async (users)=>{
                function buscarUser(){
                    const query = req.query.username.toLowerCase();

                    let usersList = []

                    users.forEach((user)=>{
                        usersList.push(user.name);
                    });

                    usersList.splice(usersList.indexOf(req.session.user), 1);

                    const usersListFiltered = usersList.filter((name)=>{
                        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query);
                    });

                    const usersListSorted = usersListFiltered.sort((a, b)=>{
                        const aStartWithQuery = a.toLowerCase().startsWith(query);
                        const bStartWithQuery = b.toLowerCase().startsWith(query);

                        if(aStartWithQuery === bStartWithQuery){
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        }

                        return aStartWithQuery ? -1 : 1;
                    });

                    return usersListSorted;
                };

                User.findOne({ name: req.session.user }).then((result)=>{
                    if(!result){
                        return res.render('busca_users.ejs', { username: req.session.user, usersList: buscarUser(), friends: [] });
                    }

                    return res.render('busca_users.ejs', { username: req.session.user, usersList: buscarUser(), friends: result.friends });
                }).catch((err)=>{
                    console.error('Erro ao buscar os amigos:', err);
                    return res.status(500).send('Erro ao buscar os amigos, tente novamente');
                });

            }).catch((err)=>{
                console.error("Ouve um erro ao buscar os usuários:", err);
                return res.status(500).send('Erro ao buscar os usuários, volte para a página inicial <a href="/">Home</a>');
            });
        }else{
            return res.redirect('/login');
        }
    });

    router.post('/add-friend', async (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            try{
                const user = await User.findOne({ name: req.session.user });

                if(user.friends.includes(req.body.user_friend)){
                    user.friends.splice(user.friends.indexOf(req.body.user_friend), 1);
                    return user.save();
                } 

                user.friends.push(req.body.user_friend);

                return user.save();
            }catch(err){
                console.error('Erro ao adicionar amigo:', err);
                return res.status(500).send('Erro ao adicionar amigo, tente novamente');
            }
        }else{
            return res.redirect('/login');
        }
    });

    router.use('/configuracoes', router_config);

    return router;
}