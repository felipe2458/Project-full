const router = require('express').Router({mergeParams: true});
const app = require('express')();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const ioS = socketIo(server);

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
                    Icon_user.findOne({ username: req.session.user }).exec((err, icon)=>{
                        const imageName = icon.imageName;

                        return res.render('page_initial.ejs', {username: req.session.user, imageName, icon: icon_check});
                    });
                }else{
                    return res.render('page_initial.ejs', {username: req.session.user, imageName: '', icon: icon_check});
                }
            })
        }else{
            return res.redirect('/login');
        }
    });

    router.get('/configuracoes', (req, res)=>{
        res.render('config_user.ejs', {username: req.params.user});
    });

    router.post('/upload-icon', async (req, res)=>{
        try{
            if(!req.files.photo_icon){
                return res.status(500).send('Erro ao enviar o arquivo');
            }

            const formato = req.files.photo_icon.name.split('.');
            const fileExtension = formato[formato.length - 1];

            const usernameDir = path.join(path.basename(__dirname), '../src/public/user_icons/', req.session.user);
            const customFileName = `${req.session.user}.${fileExtension}`;

            if(!fs.existsSync(usernameDir)){
                fs.mkdirSync(usernameDir, {recursive: true});
            }

            const newFile = path.join(usernameDir, customFileName);

            const user = await User.findOneAndUpdate({ name: req.session.user }, { icon: true }, { new: true });

            if(!user){
                return res.status(404).send('Erro ao atualizar o ícone do usuário');
            }

            Icon_user.findOne({ username: req.session.user }).then( async (user)=>{
                if(user){
                    const filePath = path.join(usernameDir, user.imageName);

                    await fs.unlink(filePath ,(err)=>{
                        if(err){
                            console.error('Erro ao deletar o ícone:', err);
                            return
                        }
                    });

                    await req.files.photo_icon.mv(newFile);

                    return Icon_user.findOneAndUpdate({ username: req.session.user }, { fileExtension, imageName: customFileName }, { new: true});
                } 

                await req.files.photo_icon.mv(newFile);

                return Icon_user.create({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.session.user,
                    fileExtension,
                    imageName: customFileName
                });
            }).catch((err)=>{
                console.error('Erro ao buscar ou atualizar o ícone:', err);
            })

            res.redirect(`/${req.session.user}/configuracoes`);
        }catch(err){
            console.error(err);
            res.status(500).send('Erro ao enviar o arquivo');
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

                return res.render('chat.ejs', { username: req.session.user, usersList });
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