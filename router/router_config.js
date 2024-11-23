const router_config = require('express').Router({mergeParams: true});
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const User = require('../mongoose/User');
const Icon_user = require('../mongoose/Icon_user');

router_config.post('/upload-icon', upload.single('photo_icon'), async (req, res) => {
    if(!req.file){
        return res.send('');
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

        return res.send();
    }catch(err){
        console.error('Erro ao salvar ícone:', err);
        res.status(500).send('Erro ao salvar o ícone.');
    }
});

router_config.post('/background', (req, res)=>{
    res.send('Ola mundo!');
});

module.exports = router_config;