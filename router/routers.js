const fs = require('fs');
const path = require('path');
const router = require('express').Router({mergeParams: true});

router.get('/', (req, res)=>{
    if(req.session.user.name){
        if(req.session.user.name.includes('_')){
            if(req.session.user.name.split('_').join('-') === req.params.user){
                return res.render('page_initial.ejs', {username: req.session.user.name});
            }
        }else{
            if(req.session.user.name === req.params.user){
                return res.render('page_initial.ejs', {username: req.session.user.name});
            }
        }
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
        const usernameDir = path.join(path.basename(__dirname), '../src/user_icons/', req.session.user.name);

        if(!fs.existsSync(usernameDir)){
            fs.mkdirSync(usernameDir, {recursive: true});
        }

        const newFile = path.join(usernameDir, `${Date.now()}.${fileExtension}`);

        await req.files.photo_icon.mv(newFile);

        res.redirect(`/${req.session.user.name}/configuracoes`);
    }catch(err){
        console.error(err);
        res.status(500).send('Erro ao enviar o arquivo');
    }
});

module.exports = router;