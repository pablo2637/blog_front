const express = require('express');
const router = express.Router();

const {
    loginUser,
    showLogin,
    logoutUser,
    showRegister,
    registerUser,
    showChange,
    changePassword } = require('../controllers/controllerUser');

const { validateJWT } = require('../middlewares/validarJwt');

const { isNotAdmin } = require('../middlewares/isAdmin');


router.get('/login', [
    validateJWT
], showLogin);


router.post('/login', loginUser);


router.get('/logout', logoutUser);


router.get('/register', showRegister);


router.post('/register', registerUser);


router.get('/change', [
    isNotAdmin
], showChange);


router.post('/changePass',changePassword);


module.exports = router