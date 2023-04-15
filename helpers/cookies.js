/**
 * @author Pablo
 * @exports Object
 * @namespace cookies
 */

/**
 * Definición del tipo User
 * @typedef {Object} User
 * @memberof cookies
 * @property {String | Number} id ID del usuario
 * @property {String} name Nombre del usuario
 * @property {String} email Email del usuario
 * @property {String} rol Rol del usuario
 */

/**
 * Crea la cookie 'userData' con caducidad de 1 hora, que almacena los datos
 * del usuario.
 * @memberof cookies
 * @method setUserCookie
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @param {User} user Es el Object con los datos del usuario
 */
const setUserCookie = async (req, res, user) => {

    await res.cookie('userData', user,
        {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });
};


/**
 * Crea la cookie 'userToken' con caducidad de 1 hora, que almacena el token generado.
 * @memberof cookies
 * @method setUserToken
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @param {String} token Es el token que se genera cuando un usuario se loguea
 * o cuando se renueva el token.
 */
const setUserToken = async (req, res, token) => {

    await res.cookie('userToken', token,
        {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });
};


/**
 * Lee la cookie 'userData'.
 * @memberof cookies
 * @method getUserDataCookie
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @returns {User} Devuelve el objecto con los datos del usuario
 */
const getUserDataCookie = async (req, res) => {

    const { userData } = req.cookies;
    return userData == undefined ? '' : userData;
};


/**
 * Lee la cookie 'userToken'.
 * @memberof cookies
 * @method getUserTokenCookie
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @returns {String} Devuelve una string con el token almacenado.
 */
const getUserTokenCookie = async (req, res) => {

    const { userToken } = req.cookies;
    return userToken;
};


/**
 * Borra las cookies creadas anteriormente: 'userData' y 'userToken'.
 * @memberof cookies
 * @method clearCookies
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas   
 */
const clearCookies = async (req, res) => {

    await res.clearCookie('userData');
    await res.clearCookie('userToken');
};


module.exports = {
    setUserCookie,
    getUserDataCookie,

    setUserToken,
    getUserTokenCookie,

    clearCookies
}