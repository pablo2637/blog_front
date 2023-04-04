const express = require('express');
const router = express.Router();

const {
    loginUser,
    showLogin,
    logoutUser } = require('../controllers/controllerUser');

const { validateJWT } = require('../middlewares/validarJwt');


router.get('/login', [
    validateJWT
], showLogin);


router.post('/login', loginUser);


router.get('/logout', logoutUser);


router.get('/register', (req, res) => {
    res.render('register', { urlTitle: 'Blog: registro' });
});


module.exports = router