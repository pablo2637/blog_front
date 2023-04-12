const jwt = require('jsonwebtoken');

const {
    getUserTokenCookie,
    setUserCookie,
    clearCookies } = require('../helpers/cookies');

/**
 * @author Pablo
 * @exports validateJWT
 * @namespace validateJWT
 */

/**
 * Se verifica que el token almacenado sea válido, si lo es, continúa al siguiente
 * paso y crea una cookie con los datos del usuario obtenidos del token.
 * Si el token no es válido, se redirige a 'login'.
 * @memberof validateJWT
 * @method validateJWT
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @param {Function} next Continúa al siguiente middleware
 * @throws Redirige a la página de login
 */
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