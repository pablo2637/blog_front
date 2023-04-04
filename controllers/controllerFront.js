const { fetchData } = require('../helpers/fetchData')
const { getURLs } = require('../configs/getURLs')

const { getUserDataCookie } = require('../helpers/cookies')


const getEntries = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntries', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            data.data.map(entry => {
                entry.date = new Date(entry.date).toLocaleDateString();
                entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
            });

            const user = await getUserDataCookie(req, res);
            console.log('blog user',user)
            res.render('blog', {
                urlTitle: 'Blog: entradas',
                msg: '',
                entries: data,
                user
            });
        }

    } catch (e) {
        console.log('errrorr',e)
        res.status(500).render('index', {
            urlTitle: 'Blog: entradas',
            msg: `Error en getEntries: ${e}`,
            user:''
        });

    }
};


const searchEntries = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntriesBySearch', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            data.data.map(entry => {
                entry.date = new Date(entry.date).toLocaleDateString();
                entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
            })

            const user = await getUserDataCookie(req, res);

            res.render('blog', {
                urlTitle: 'Blog: entradas',
                msg: '',
                entries: data,
                user
            });
        }

    } catch (e) {
        res.status(500).render('index', {
            urlTitle: 'Blog: entradas',
            msg: `Error en searchEntries: ${e}`
        });

    }
};


const searchEntriesByEmail = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntriesByEmail', req);

        const { data } = await fetchData(url, method);
        console.log(data)
        if (data.ok) {

            data.data.map(entry => {
                entry.date = new Date(entry.date).toLocaleDateString();
                entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
            })

            const user = await getUserDataCookie(req, res);

            res.render('blog', {
                urlTitle: 'Blog: entradas',
                msg: 'email',
                entries: data,
                user
            });
        }

    } catch (e) {
        res.status(500).render('index', {
            urlTitle: 'Blog: entradas',
            msg: `Error en searchEntriesByEmail: ${e}`
        });

    }
};


module.exports = {
    getEntries,
    searchEntries,
    searchEntriesByEmail
}