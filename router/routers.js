const router = require('express').Router({mergeParams: true});

router.get('/', (req, res)=>{
    if(req.session.user.name === req.params.user){
        return res.render('page_initial.ejs');
    }else{
        return res.redirect('/login');
    }
});

module.exports = router;