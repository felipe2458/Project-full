const router = require('express').Router({mergeParams: true});
const app = require('express')();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const ioS = socketIo(server);

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const User = require('../mongoose/User');
const Icon_user = require('../mongoose/Icon_user');
const Friends = require('../mongoose/Friends');

module.exports = (io)=>{
    router.get('/home', (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            const userCookie = req.cookies.username;

            if(userCookie){
                req.session.user = userCookie;
            }

            User.findOne({ name: req.session.user }).exec((err, user)=>{
                const icon_check = user.icon;

                if(icon_check){
                    Icon_user.findOne({ username: req.session.user }).then((result)=>{
                        const base64Image = result.data.toString('base64');
                        const imageSrc = `data:${result.contentType};base64,${base64Image}`;

                        return res.render('page_initial.ejs', {username: req.session.user, image: imageSrc, icon: icon_check});
                    }).catch((err)=>{
                        console.error('Erro ao buscar ícone:', err);
                        return res.status(500).send('Erro ao buscar ícone, tente novamente');
                    });
                }else{
                    return res.render('page_initial.ejs', {username: req.session.user, image: null, icon: icon_check});
                }
            })
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/configuracoes', (req, res)=>{
        res.render('config_user.ejs', {username: req.params.user});
    });

    router.post('/upload-icon', upload.single('photo_icon'), async (req, res) => {
        if(!req.file){
            return res.status(400).send('Nenhum arquivo enviado.');
        }

        try{
            const user = await User.findOne({ name: req.session.user });

            if(!user){
                return res.status(404).send('Usuário não encontrado.');
            }

            if(user.icon){
                Icon_user.findOne({ username: req.session.user }).then((result)=>{
                    if(!result){
                        return res.status(404).send('Usuário não encontrado.');
                    }

                    result.imageName = req.file.originalname;
                    result.data = req.file.buffer;
                    result.contentType = req.file.mimetype;

                    result.save();
                }).catch((err)=>{
                    console.error('Erro ao atualizar ícone:', err);
                    return res.status(500).send('Erro ao atualizar ícone, tente novamente');
                });
            }else{
                user.icon = true;

                await Icon_user.create({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.session.user,
                    imageName: req.file.originalname,
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                });

                await user.save();
            }

            return res.redirect(`/${req.session.user.split('_').join('-')}/configuracoes`);
        }catch(err){
            console.error('Erro ao salvar ícone:', err);
            res.status(500).send('Erro ao salvar o ícone.');
        }
    });

    router.get('/chat', (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
            User.find({}).exec().then((users)=>{
                let usersList = [];

                users.forEach((user)=>{
                    usersList.push(user.name);
                });

                usersList.splice(usersList.indexOf(req.session.user), 1);

                Friends.findOne({ username_logged_in: req.session.user }).then((result)=>{
                    if(!result){
                        return res.render('chat.ejs', { username: req.session.user, usersList, friends: [], friendsIconsVal: [], friendsIcons: [] });
                    }

                    User.find({}).exec().then((users)=>{
                        let usersListFriends = [];
                        let friendsList = [];
                        let friendsIconsVal = [];

                        users.forEach((user)=>{
                            usersListFriends.push({ name: user.name, icon: user.icon });
                        });

                        result.Friends.forEach((friend)=>{
                            friendsList.push({ name: friend });
                        });

                        for(let i = 0; i < usersListFriends.length; i++){
                            if(friendsList.some((friend) => friend.name === usersListFriends[i].name)){
                                friendsIconsVal.push({ nameFriend: usersListFriends[i].name, icon: usersListFriends[i].icon });
                            }
                        }

                        Icon_user.find({}).exec().then((icons)=>{
                            let iconsFriends = [];

                            icons.forEach((icon)=>{
                                const base64Image = icon.data.toString('base64');
                                const imageSrc = `data:${icon.contentType};base64,${base64Image}`;
                                iconsFriends.push({ username: icon.username, data: imageSrc });
                            });

                            const index_user_logged_in = iconsFriends.findIndex(user => user.username === req.session.user );

                            if(index_user_logged_in !== -1){
                                iconsFriends.splice(index_user_logged_in, 1);
                            }

                            return res.render('chat.ejs', { username: req.session.user, usersList, friends: result.Friends, friendsIconsVal, iconsFriends });
                        }).catch((err)=>{
                            console.error('Erro ao buscar os ícones dos amigos:', err);
                            return res.status(500).send('Erro ao buscar os ícones dos amigos, tente novamente');
                        });
                    }).catch((err)=>{
                        console.error('Erro ao buscar os amigos:', err);    
                        return res.status(500).send('Erro ao buscar os amigos, tente novamente');
                    });

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

    router.get('/buscar-user', (req, res)=>{
        if(req.session.user && req.session.user.split('_').join('-') === req.params.user && req.query.username ){
            User.find({}).exec().then( async (users)=>{
                function buscarUser(){
                    const query = req.query.username.toLowerCase();

                    let usersList = []

                    users.forEach((user)=>{
                        usersList.push(user.name);
                    });

                    usersList.splice(usersList.indexOf(req.session.user), 1);

                    const usersListFiltered = usersList.filter((name)=>{
                        return name.toLowerCase().includes(query);
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

                Friends.findOne({ username_logged_in: req.session.user }).then((result)=>{
                    if(!result){
                        return res.render('busca_users.ejs', { username: req.session.user, usersList: buscarUser(), friends: [] });
                    }

                    return res.render('busca_users.ejs', { username: req.session.user, usersList: buscarUser(), friends: result.Friends });
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
                Friends.findOne({ username_logged_in: req.session.user }).then((user)=>{
                    if(!user){
                        Friends.create({
                            _id: new mongoose.Types.ObjectId(),
                            username_logged_in: req.session.user,
                            Friends: [req.body.user_friend]
                        })

                        return
                    }else{
                        const friends = user.Friends;

                        if(!friends.includes(req.body.user_friend)){
                            friends.push(req.body.user_friend);
                            user.save();
                        }else{
                            let index = friends.indexOf(req.body.user_friend);

                            if(index !== -1){
                                friends.splice(index, 1)
                                user.save();
                            }
                        }

                        return res.send('');
                    }
                }).catch((err)=>{
                    console.error('Erro ao buscar os amigos:', err);
                    return res.status(500).send('Erro ao buscar os amigos, tente novamente');
                });
            }catch(err){
                console.error(err);
            }
        }else{
            return res.redirect('/login');
        }
    });

    return router;
}