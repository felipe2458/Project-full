const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('home.ejs');
});

router.get('/register', (req, res)=>{
    res.render('register_user.ejs');
});

router.post('/register', (req, res)=>{
    res.send('Olá mundo!');
});

router.get('/login', (req, res)=>{
    res.render('login.ejs');
});

router.post('/login', ()=>{
    res.send('Olá mundo!');
});

module.exports = router;