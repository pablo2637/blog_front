const jwt = require('jsonwebtoken');

const {
    setUserToken,
    getUserDataCookie,
    setUserCookie } = require('../helpers/cookies');



/**
 * @author Pablo
 * @exports Object
 * @namespace jwt
 */

/**
 * Definición del tipo User
 * @typedef {Object} User
 * @memberof jwt
 * @property {String | Number} id ID del usuario
 * @property {String} name Nombre del usuario
 * @property {String} email Email del usuario
 * @property {String} rol Rol del usuario
 */

/**
 * Helper que genera un token con caducidad de 1 hora, a partir de un payload, que
 * es un Object :User.
 * @memberof jwt
 * @method generateJwt
 * @param {User} payload El payload para generar el token
 * @returns {Promise} Devuelve el token generado en un String
 * @throws {Object} Devuelve los errores en un Object
 */
const generateJwt = (payload) => {

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' },
            (error, token) => {

                if (error)
                    reject({
                        ok: false,
                        msg: 'generateJwt: Error al generar el token.'
                    });

                resolve(token);
            }
        );

    });
};


/**
 * Cumple 2 funciones: verificar y renovar el token, si es que es válido.
 * Si lo es, lo almacena nuevamente en una cookie.
 * @memberof jwt
 * @method renewToken
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas  
 * @returns {Object} Devuelve un Object con la confirmación de que el token 
 * se ha creado correctamente
 * @throws {Object} Devuelve un Object con un mensaje de error al renovar el token.
 */
const renewToken = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    const token = await generateJwt(user);

    if (!token)
        return {
            ok: false,
            msg: 'renewToken: renovación del token incorrecta.'
        };

    await setUserCookie(req, res, user);
    await setUserToken(req, res, token);

    return {
        ok: true,
        msg: 'renewToken: renovación del token correcta.'
    };
};


module.exports = {
    generateJwt,
    renewToken
}