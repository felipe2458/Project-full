const router_jogos = require('express').Router({mergeParams: true});
const app = require('express')();
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

const User = require('../mongoose/User');

const background_bg = require('../config/background/bgnd.json');
const isDarkMode = require('../config/background/background');

router_jogos.get('/cidade-dorme', async (req, res)=>{
    if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
        const users = await User.find({});
        const user = await User.findOne({ name: req.session.user });
        let users_icons = [];

        users.forEach(user =>{
            const base64Image =  user.icon.data ? user.icon.data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${user.icon.contentType};base64,${base64Image}` : false;

            users_icons.push({ name: user.name, icon: imageSrc });
        });

        res.render('jogos/cidade_dorme.ejs', { 
            username: req.session.user, 
            users_icons,
            //background_val: isDarkMode(user, 'cidade_dorme'),
        });
    }else{
        return res.redirect('/login');
    }
});

router_jogos.get('/jogo-da-velha', async (req, res)=>{
    if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
        const users = await User.find({});
        const user = await User.findOne({ name: req.session.user });
        let users_icons = [];

        users.forEach(user =>{
            const base64Image =  user.icon.data ? user.icon.data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${user.icon.contentType};base64,${base64Image}` : false;

            users_icons.push({ name: user.name, icon: imageSrc });
        });

        res.render('jogos/jogo_da_velha.ejs', { username: req.session.user, users_icons});
    }
});

module.exports = router_jogos;