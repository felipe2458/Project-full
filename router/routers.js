const router = require('express').Router({mergeParams: true});
const Icon_user = require('../mongoose/Icons');

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

module.exports = router;