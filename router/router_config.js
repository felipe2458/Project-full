const router_config = require('express').Router({mergeParams: true});
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const User = require('../mongoose/User');

router_config.post('/upload-icon', upload.single('photo_icon'), async (req, res) => {
    try{
        const user = await User.findOne({ name: req.session.user });

        if(!user){
            return res.status(404).send('Usuário não encontrado.');
        }

        user.icon[0].data = req.file.buffer;
        user.icon[0].contentType = req.file.mimetype;

        user.save();

        return res.send('Ícone salvo com sucesso!');
    }catch(err){
        console.error('Erro ao salvar ícone:', err);
        res.status(500).send('Erro ao salvar o ícone.');
    }
});

router_config.post('/background', async (req, res)=>{
    try{
        const user = await User.findOne({ name: req.session.user });

        user.background[0].darkmode = req.body.darkmode;

        user.save();

        return res.send('Background atualizado com sucesso!');
    }catch(err){
        console.error('Erro ao salvar background:', err);
        return res.status(500).send('Erro ao salvar o background.');
    }
});

module.exports = router_config;