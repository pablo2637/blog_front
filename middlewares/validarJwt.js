const jwt = require('jsonwebtoken');

const {
    getUserTokenCookie,
    setUserCookie,
    clearCookies } = require('../helpers/cookies');


const validateJWT = async (req, res, next) => {

    const token = await getUserTokenCookie(req, res);

    if (token) {
        try {

            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = {
                id: payload.id,
                name: payload.name,
                email: payload.email,
                rol: payload.rol
            };

            await setUserCookie(req, res, user);

            next();

        } catch (e) {

            clearCookies(req, res);
            res.redirect('/user/login');

        };

    } else
        res.redirect('/user/login');

};


module.exports = { validateJWT };