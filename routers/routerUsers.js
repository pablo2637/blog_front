const express = require('express');
const router = express.Router();

const {
    loginUser,
    showLogin,
    logoutUser,
    showRegister,
    registerUser } = require('../controllers/controllerUser');

const { validateJWT } = require('../middlewares/validarJwt');


router.get('/login', [
    validateJWT
], showLogin);


router.post('/login', loginUser);


router.get('/logout', logoutUser);


router.get('/register', showRegister);


router.post('/register', registerUser);


module.exports = router