// const urlBaseBack = process.env.URL_BASE_BACK;
const urlBaseBack = 'https://blog-back-91me.onrender.com';
const urlAPIEntries = 'api/entries';
const urlAPIUser = 'api/users';

const limitePorDefecto = 10;

const getURLs = (tipo, data) => {

    const body = data.body;
    const params = data.params;
    const query = data.query;

    const page = query.page || 1;
    const limit = query.limit || limitePorDefecto;

    let url, method;

    console.log('getURLs: tipo', tipo, 'query', query, 'params', params);

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


    };

    return { url, method };
}


module.exports = { getURLs }