const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const { generateJwt } = require('../helpers/jwt');

const {
    setUserCookie,
    setUserToken,
    getUserDataCookie,
    clearCookies } = require('../helpers/cookies');

/**
 * @author Pablo
 * @exports Object
 * @namespace controllerUser
 */

/**
 * Definición del tipo User
 * @typedef {Object} User
 * @memberof controllerUser
 * @property {String | Number} id ID del usuario
 * @property {String} name Nombre del usuario
 * @property {String} email Email del usuario
 * @property {String} rol Rol del usuario
 */

/**
* Renderiza 'login' para loguearse en la aplicación.
* @memberof controllerUser 
* @method showLogin
* @async
* @param {Object} req Es el requerimiento que proviene de las rutas
* @param {Object} res Es la respuesta que proviene de las rutas 
*/
const showLogin = async (req, res) => {

    await clearCookies(req, res);

    res.render('login', {
        urlTitle: 'Blog: login',
        user: '',
        error: ''
    });

};


/**
* Renderiza 'register' para registrar un usuario nuevo en la aplicación.
* @memberof controllerUser 
* @method showRegister
* @async
* @param {Object} req Es el requerimiento que proviene de las rutas
* @param {Object} res Es la respuesta que proviene de las rutas 
*/
const showRegister = async (req, res) => {

    await clearCookies(req, res);

    res.render('register', {
        urlTitle: 'Blog: registro',
        user: '',
        error: ''
    });

};


/**
 * Recibe los datos para primero validar, y luego, crear el usuario nuevo,
 * si las validaciones son correctas se redirige al 'index'.
 * En caso de errores se devuelven en un Object, y se renderiza el 'register'.
 * @memberof controllerUser 
 * @method registerUser
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * body.password, body.passwordR, body.name y body.email.
 * @param {Object} res Es la respuesta que proviene de las rutas    
 * @throws {json} Devuelve el error
 */
const registerUser = async (req, res, next) => {

    let err = {};
    try {

        if (req.body.password != req.body.passwordR) {
            err.passwordR = 'Los passwords no coinciden, por favor, revísalos.';

            return res.render('register', {
                urlTitle: 'Blog: registro error',
                user: req.body,
                error: err
            });
        }

        const { url, method } = getURLs('postUser', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok) {

            const user = {
                id: data.data[0].userid,
                name: data.data[0].name,
                email: data.data[0].email,
                rol: 'user'
            };

            const token = await generateJwt(user);

            await setUserCookie(req, res, user);
            await setUserToken(req, res, token);

            res.redirect('/');

        } else {

            if (data.errors) {

                const e = data.errors;

                if (e.name)
                    err.name = e.name.msg;

                if (e.password)
                    err.password = e.password.msg;

                if (e.email)
                    err.email = e.email.msg;

            }

            res.render('register', {
                urlTitle: 'Blog: registro error',
                user: req.body,
                error: err
            });
        }


    } catch (e) {
        console.log(`catchError en registerUser:`, e);

        return res.status(500).json({
            ok: false,
            msg: `Error en registerUser: ${e}`
        });

    };
};


/**
 * Recibe los datos para validar primero, y luego loguear al usuario.
 * Si las validaciones son correctas se redirige al 'index' de usuario o administrador
 * según el rol del usuario, y se crean 2 cookies, una con el token y otros con los datos
 * del usuario (id, name, email, rol).
 * En caso de errores se devuelven en un Object, y se renderiza el 'login'.
 * @memberof controllerUser 
 * @method loginUser
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * body.password y body.email.
 * @param {Object} res Es la respuesta que proviene de las rutas    
 * @throws {json} Devuelve el error
 */
const loginUser = async (req, res) => {

    let error;
    try {

        const { url, method } = getURLs('loginUser', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok) {

            const user = data.user;
            user.email = req.body.email;

            const token = await generateJwt(user);

            await setUserCookie(req, res, user);
            await setUserToken(req, res, token);

            if (user.rol == 'admin')
                res.redirect('/admin');

            else
                res.redirect('/');

        } else {

            if (data.errors) {
                if (data.errors.email) error = data.errors.email.msg;

            } else error = data.msg;

            res.render('login', {
                urlTitle: 'Blog: login error',
                user: req.body.email,
                error
            });

        }

    } catch (e) {
        console.log('catchError en loginUser:', e);

        return res.status(500).json({
            ok: false,
            msg: `Error en loginUser: ${e}`
        });

    };
};


/**
 * Registra el logout del usuario, borra las cookies creadas y redirige al 'index'.
 * En caso de errores se devuelven en un Object.
 * @memberof controllerUser 
 * @method logoutUser
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * body.password y body.email.
 * @param {Object} res Es la respuesta que proviene de las rutas    
 * @throws {json} Devuelve el error
 */
const logoutUser = async (req, res) => {

    try {

        const { url, method } = getURLs('logoutUser', req);

        const user = await getUserDataCookie(req, res);
        req.body = user;

        const { data } = await fetchData(url, method, req.body);

        await clearCookies(req, res);

        res.redirect('/');

    } catch (e) {

        console.log(`catchError en logoutUser:`, e);

        return res.status(500).JSON({
            ok: false,
            msg: `Error en logoutUser: ${e}`
        });

    };
};


/**
* Redirige al usuario al 'index' que corresponda según su rol: user o admin.
* @memberof controllerUser 
* @method redirectUser
* @async
* @param {Object} req Es el requerimiento que proviene de las rutas
* @param {Object} res Es la respuesta que proviene de las rutas 
*/
const redirectUser = async (req, res) => {

    const { rol } = await getUserDataCookie(req, res);

    if (rol == 'admin')
        res.redirect('/admin');

    else
        res.redirect('/');

};


/**
 * Renderiza 'changePassword' del administrador para permitir cambiar la contraseña,
 * se envía un Object :User
 * @memberof controllerUser
 * @method showChange
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
 */
const showChange = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    res.render('changePassword', {
        urlTitle: 'Blog: cambiar password',
        error: '',
        user
    });

};


/**
 * Recibe los datos para primero validar, y luego, cambiar la contraseña del usuario,
 * si las validaciones son correctas se redirige al 'index'.
 * En caso de errores se devuelven en un Object, y se renderiza el 'changePassword'.
 * @memberof controllerUser
 * @method changePassword
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * body.newPassword, body.oldPassword, body.passwordR y body.email.
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @throws {json} Devuelve el error
 */
const changePassword = async (req, res, next) => {

    let err = {};
    try {

        if (req.body.newPassword != req.body.passwordR) {

            err.passwordR = 'Los passwords no coinciden, por favor, revísalos.';

            return res.render('changePassword', {
                urlTitle: 'Blog: cambiar password error',
                user: req.body,
                error: err
            });
        }

        const { url, method } = getURLs('changePassword', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok)
            res.redirect('/');

        else {

            if (data.errors) {

                const e = data.errors;

                if (e.oldPassword)
                    err.oldPassword = e.oldPassword.msg;

                if (e.newPassword)
                    err.newPassword = e.newPassword.msg;

            } else if (data.error)
                err.oldPassword = data.error;

            res.render('changePassword', {
                urlTitle: 'Blog: cambiar password error',
                user: req.body,
                error: err
            });
        }


    } catch (e) {
        console.log(`catchError en changePassword:`, e);

        return res.status(500).json({
            ok: false,
            msg: `Error en changePassword: ${e}`
        });

    };
};


module.exports = {
    loginUser,
    showLogin,
    redirectUser,
    logoutUser,
    showRegister,
    registerUser,
    showChange,
    changePassword
}