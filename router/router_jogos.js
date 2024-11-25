const router_jogos = require('express').Router({mergeParams: true});
const app = require('express')();
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

const User = require('../mongoose/User');

const background = require('./config/background');

router_jogos.get('/cidade-dorme', async (req, res)=>{
    if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
        const users = await User.find({});
        const user = await User.findOne({ name: req.session.user });
        const background_val = user.background[0].darkmode ? background[0].darkmode.jogos.cidade_dorme : background[0].lightmode.jogos.cidade_dorme;
        let users_icons = [];

        console.log(background_val);

        users.forEach(user =>{
            const base64Image =  user.icon[0].data ? user.icon[0].data.toString('base64') : false;
            const imageSrc = base64Image ? `data:${user.icon[0].contentType};base64,${base64Image}` : false;

            users_icons.push({ name: user.name, icon: imageSrc });
        });

        res.render('cidade_dorme.ejs', { 
            username: req.session.user, 
            users_icons,
            background_val,
        });
    }else{
        return res.redirect('/login');
    }
});

module.exports = router_jogos;