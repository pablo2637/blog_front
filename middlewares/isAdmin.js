const { getUserDataCookie } = require('../helpers/cookies');

const { renewToken } = require('../helpers/jwt');

/**
 * @author Pablo
 * @exports Object
 * @namespace isAdmin
 */

/**
 * Primero se comprueba que el token almacenado sea válido y luego, comprueba 
 * si el usuario tiene rol de 'admin', si es así, continúa al siguiente 
 * paso, si no, se redigire al 'index' del usuario. En cualquier de los
 * 2 casos, el token se renueva.
 * Si el token no es válido, se redirige a 'login'.
 * @memberof isAdmin
 * @method isAdmin
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @param {Function} next Continúa al siguiente middleware
 * @throws Redirige a la página de login
 */
const isAdmin = async (req, res, next) => {

    try {

        await renewToken(req, res);

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'admin')
            res.redirect('/');

        else
            next();

    } catch (e) {

        res.redirect('/user/login');

    };
};



/**
 * Primero se comprueba que el token almacenado sea válido y luego, comprueba 
 * si el usuario tiene rol de 'user', si es así, continúa al siguiente 
 * paso, si no, se redigire al 'index' del administrador. En cualquier de los
 * 2 casos, el token se renueva.
 * Si el token no es válido, se redirige a 'login'.
 * @memberof isAdmin
 * @method isNotAdmin
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @param {Function} next Continúa al siguiente middleware
 */
const isNotAdmin = async (req, res, next) => {

    try {

        await renewToken(req, res);

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'user')
            res.redirect('/admin');

        else
            next();

    } catch (e) {

        res.redirect('/user/login');

    };
};


module.exports = {
    isAdmin,
    isNotAdmin
}