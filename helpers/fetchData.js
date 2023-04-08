//Fetch
const fetchData = async (url, method, body) => {

    body = JSON.stringify(body);
    let options = {};

    if (method == 'POST' || method == 'PUT')
        options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body
        };
    else if (method == 'DELETE') options = { method };

    //console.log('fetchData: url', url, 'body', body, 'options', options);


    try {

        const request = await fetch(url, options);
        const response = await request.json();

        if (!response) return {
            ok: false,
            msg: 'Error fetchData',
            response
        };

        return {
            ok: true,
            data: response
        };

    } catch (e) {
       
        return {
            ok: false,
            error: e
        };

    };
};


module.exports = { fetchData }