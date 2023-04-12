const urlBaseBack = process.env.URL_BASE_BACK;
const urlAPIEntries = 'api/entries';
const urlAPIUser = 'api/users';
const urlAPILogs = 'api/logs';

const limitePorDefecto = 5;

/**
 * @author Pablo
 * @exports getURLs
 * @namespace getURLs
 */

/**
 * Devuelve la url y el método para pasar a un fetch.
 * @memberof getURLs 
 * @method getURLs
 * @param {String} tipo El tipo de acción que se quiere realizar (ej: 'getEntries')
 * @param {Object} data Es el requerimiento 'req' de las rutas
 * @returns {Object} Devuelve 'url :string' y 'method :string' para pasar a la función de fetchData 
 */

const getURLs = (tipo, data) => {

    const body = data.body;
    const params = data.params;
    const query = data.query;

    const page = body.page || query.page || 1;
    const limit = body.limit || query.limit || limitePorDefecto;

    let url, method;

    switch (tipo) {

        //API Entries ***********************
        case 'getEntries':
            url = `${urlBaseBack}/${urlAPIEntries}?limit=${limit}&page=${page}`;
            break;

        case 'getEntriesBySearch':
            url = `${urlBaseBack}/${urlAPIEntries}/search/${body.text}?limit=${limit}&page=${page}`;
            break;

        case 'getEntriesByEmail':
            url = `${urlBaseBack}/${urlAPIEntries}/email/${params.email}?limit=${limit}&page=${page}`;
            break;

        case 'getEntryByID':
            url = `${urlBaseBack}/${urlAPIEntries}/id/${params.entryID}`;
            break;

        case 'postEntry':
            url = `${urlBaseBack}/${urlAPIEntries}`;
            method = 'POST';
            break;

        case 'putEntry':
            url = `${urlBaseBack}/${urlAPIEntries}`;
            method = 'PUT';
            break;

        case 'deleteEntry':
            url = `${urlBaseBack}/${urlAPIEntries}/${params.entryID}`;
            method = 'DELETE';
            break;


        //API User ***********************
        case 'loginUser':
            url = `${urlBaseBack}/${urlAPIUser}/login`;
            method = 'POST';
            break;

        case 'logoutUser':
            url = `${urlBaseBack}/${urlAPIUser}/logout`;
            method = 'POST';
            break;

        case 'getUsers':
            url = `${urlBaseBack}/${urlAPIUser}`;
            break;

        case 'postUser':
            url = `${urlBaseBack}/${urlAPIUser}`;
            method = 'POST';
            break;

        case 'changePassword':
            url = `${urlBaseBack}/${urlAPIUser}/changePassword`;
            method = 'PUT';
            break;


        //API Logs ***********************
        case 'getLogs':
            url = `${urlBaseBack}/${urlAPILogs}?limit=${limit}&page=${page}`;            
            break;

    };

    return { url, method };
};


module.exports = { getURLs }