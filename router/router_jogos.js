const router_jogos = require('express').Router({mergeParams: true});
const app = require('express')();
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

const User = require('../mongoose/User');
const Icon_user = require('../mongoose/Icon_user');

router_jogos.get('/cidade-dorme', (req, res)=>{
    if(req.session.user && req.session.user.split('_').join('-') === req.params.user){
        let users_icons = [];

        Icon_user.find({}).exec().then((icon_result)=>{
            icon_result.forEach(icon_for =>{
                const base64Image = icon_for.data.toString('base64');
                const imageSrc = `data:${icon_for.contentType};base64,${base64Image}`;

                users_icons.push({ name: icon_for.username, icon: imageSrc });
            });

            return res.render('cidade_dorme.ejs', { username: req.session.user, users_icons });
        }).catch((err)=>{
            console.error('Erro ao buscar ícone:', err);
            return res.status(500).send('Erro ao buscar ícone, tente novamente');
        });
    }else{
        return res.redirect('/login');
    }
});

module.exports = router_jogos;