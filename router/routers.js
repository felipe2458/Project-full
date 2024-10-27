const path = require('path');
const fs = require('fs');
const router = require('express').Router({mergeParams: true});
const mongoose = require('mongoose');
const Icon_user = require('../mongoose/Icon_user');
const User = require('../mongoose/User');

router.get('/home', (req, res)=>{
    if(req.session.user.name && req.session.user.name.split('_').join('-') === req.params.user){
        User.findOne({ name: req.session.user.name }).exec((err, user)=>{
            const icon_check = user.icon;

            if(icon_check){
                Icon_user.findOne({ username: req.session.user.name }).exec((err, icon)=>{
                    const imageName = icon.imageName;

                    return res.render('page_initial.ejs', {username: req.session.user.name, imageName, icon: icon_check});
                });
            }else{
                return res.render('page_initial.ejs', {username: req.session.user.name, imageName: '', icon: icon_check});
            }
        })
    }else{
        return res.redirect('/login');
    }
});

router.get('/configuracoes', (req, res)=>{
    res.render('config_user.ejs', {username: req.params.user});
});

router.post(`/upload-icon`, async (req, res)=>{
    try{
        if(!req.files.photo_icon){
            return res.status(500).send('Erro ao enviar o arquivo');
        }

        const formato = req.files.photo_icon.name.split('.');
        const fileExtension = formato[formato.length - 1];

        const usernameDir = path.join(path.basename(__dirname), '../src/public/user_icons/', req.session.user.name);

        const customFileName = `${req.session.user.name}.${fileExtension}`;

        if(!fs.existsSync(usernameDir)){
            fs.mkdirSync(usernameDir, {recursive: true});
        }

        const newFile = path.join(usernameDir, customFileName);

        const user = await User.findOneAndUpdate({ name: req.session.user.name }, { icon: true }, { new: true });

        if(!user){
            return res.status(404).send('Erro ao atualizar o ícone do usuário');
        }

        Icon_user.findOne({ username: req.session.user.name }).then( async (user)=>{
            if(user){
                const filePath = path.join(usernameDir, user.imageName);

                await fs.unlink(filePath ,(err)=>{
                    if(err){
                        console.error('Erro ao deletar o ícone:', err);
                        return
                    }
                });

                await req.files.photo_icon.mv(newFile);

                return Icon_user.findOneAndUpdate({ username: req.session.user.name }, { fileExtension, imageName: customFileName }, { new: true});
            } 

            await req.files.photo_icon.mv(newFile);

            return Icon_user.create({
                _id: new mongoose.Types.ObjectId(),
                username: req.session.user.name,
                fileExtension,
                imageName: customFileName
            });
        }).catch((err)=>{
            console.error('Erro ao buscar ou atualizar o ícone:', err);
        })

        res.redirect(`/${req.session.user.name}/configuracoes`);
    }catch(err){
        console.error(err);
        res.status(500).send('Erro ao enviar o arquivo');
    }
});

module.exports = router;