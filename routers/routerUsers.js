const express = require('express');
const router = express.Router();

const {
    loginUser,
    logoutUser,
    showRegister,
    registerUser,
    showChange,
    redirectUser,
    changePassword,
    showLogin } = require('../controllers/controllerUser');

const { validateJWT } = require('../middlewares/validarJwt');

const { isNotAdmin } = require('../middlewares/isAdmin');


router.get('/verify', [
    validateJWT
], redirectUser);


router.get('/login', showLogin);


router.post('/login', loginUser);


router.get('/logout', logoutUser);


router.get('/register', showRegister);


router.post('/register', registerUser);


router.get('/change', [    
    isNotAdmin
], showChange);


router.post('/changePass', [    
    isNotAdmin
], changePassword);


module.exports = router