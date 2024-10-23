const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('home.ejs');
});

router.get('/login', (req, res)=>{
    res.render('login.ejs');
});

router.post('/login', ()=>{
    res.send('Olá mundo!');
});

module.exports = router;