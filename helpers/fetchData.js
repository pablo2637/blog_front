const fetch = require('node-fetch');
/**
 * @author Pablo
 * @exports Object
 * @namespace fetchData
 */

/**
 * Helper reutilizable para realizar todas las consultas fetch
 * @memberof fetchData
 * @method fetchData
 * @async
 * @param {String} url La url para pasar al método fetch
 * @param {String} method El método para pasar al método fetch
 * @param {Object} [body] El body con la información para pasar al método fetch
 * @returns {Object} Devuelve la respuesta de la consulta del fetch
 * @throws {Object} Devuelve los errores en un Object
 */
const fetchData = async (url, method, body) => {

    body = JSON.stringify(body);
    let options = {};

    if (method == 'POST' || method == 'PUT')
        options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body
        };

    else if (method == 'DELETE')
        options = { method };


    try {

        const request = await fetch(url, options);
        const response = await request.json();

        if (!response)
            return {
                ok: false,
                msg: 'Error fetchData',
                response
            };

        return {
            ok: true,
            data: response
        };

    } catch (e) {
        console.log('catchError en fetchData', e);

        return {
            ok: false,
            error: e
        };

    };
};


module.exports = { fetchData }