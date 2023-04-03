const express = require('express');
const router = express.Router();

const { loginUser } = require('../controllers/controllerUser');


router.get('/login', (req, res) => {
    res.render('login', {
        urlTitle: 'Blog: login',
        user: '',
        error: ''
    });
});


router.post('/login', loginUser);


router.get('/register', (req, res) => {
    res.render('register', { urlTitle: 'Blog: registro' });
});


module.exports = router