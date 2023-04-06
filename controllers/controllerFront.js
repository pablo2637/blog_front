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

            res.render('blog', {
                urlTitle: 'Blog: entradas',
                msg: '',
                entries: data,
                user
            });
        }

    } catch (e) {
        console.log('errrorr', e)
        res.status(500).send({
            urlTitle: 'Blog: entradas',
            msg: `Error en getEntries: ${e}`
        });

    }
};


const searchEntries = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntriesBySearch', req);

        let { data } = await fetchData(url, method);

        if (data.ok) {

            let message;
            if (data.data) {
                message = `Has buscado: '${req.body.text}'...`;

                data.data.map(entry => {
                    entry.date = new Date(entry.date).toLocaleDateString();
                    entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
                });

            } else {
                data = { ok: false };
                message = `Oh.. tu búsqueda: '${req.body.text}', no hay dado resultados...`;

            }

            const user = await getUserDataCookie(req, res);

            res.render('blog', {
                urlTitle: 'Blog: entradas',
                msg: message,
                entries: data,
                user
            });
        }

    } catch (e) {
        res.status(500).send('index', {
            urlTitle: 'Blog: entradas',
            msg: `Error en searchEntries: ${e}`
        });

    }
};


const searchEntriesByEmail = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntriesByEmail', req);

        const { data } = await fetchData(url, method);

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
        res.status(500).send({
            urlTitle: 'Blog: entradas',
            msg: `Error en searchEntriesByEmail: ${e}`
        });

    }
};


const getEntryByID = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntryByID', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            const entry = data.data[0];

            entry.date = new Date(entry.date).toLocaleDateString();
            entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();

            const user = await getUserDataCookie(req, res);

            res.render('detail', {
                urlTitle: 'Blog: entrada',
                entry,
                user
            });
        }

    } catch (e) {
        res.status(500).send({
            urlTitle: 'Blog: entrada',
            msg: `Error en getEntryByID: ${e}`
        });

    }
};


const showNew = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    res.render('new', {
        urlTitle: 'Blog: nueva',
        msg: '',
        entry: '',
        user
    });

};


const createEntry = async (req, res) => {

    try {

        if (req.file != undefined)
            req.body.image = req.file.filename;
            
        else
            req.body.image = '';     

        const { url, method } = getURLs('postEntry', req);
        const { data } = await fetchData(url, method, req.body);

        if (data.ok)
            res.redirect(`/blog`);

        else {

            if (data.errors) {
                let err = {};
                const e = data.errors;

                if (e.title)
                    err.title = e.title.msg;

                if (e.content)
                    err.content = e.content.msg;

                if (e.extract)
                    err.extract = e.extract.msg;

                if (e.image)
                    err.image = e.image.msg;

                const user = await getUserDataCookie(req, res);

                res.render('new', {
                    entry: req.body,
                    msg: err,
                    urlTitle: 'Blog: nueva',
                    user
                });

            } else
                res.status(500).send({
                    urlTitle: 'Blog: error',
                    msg: `Error en showEdit`,
                    data
                });

        }

    } catch (e) {

        res.status(500).send({
            urlTitle: 'Blog: error',
            msg: `Error en createEntry: ${e}`
        });

    }
};


const showEdit = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntryByID', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            const entry = data.data[0];

            entry.date = new Date(entry.date).toLocaleDateString();
            entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();

            const user = await getUserDataCookie(req, res)

            res.render('edit', {
                urlTitle: 'Blog: editar',
                msg: '',
                entry,
                user
            });

        }

    } catch (e) {
        console.log('errrorr', e)
        res.status(500).send({
            urlTitle: 'Blog:  editar',
            msg: `Error en showEdit: ${e}`
        });

    }
};


const editEntry = async (req, res) => {

    try {

        let oldPic = req.body.image;

        try {
            if (req.file != undefined)
                await fs.unlink(`./public/media/${oldPic}`);

        } catch (error) {

        } finally {

            if (req.file != undefined)
                req.body.image = req.file.filename;
            else
                req.body.image;
        }


        const { url, method } = getURLs('putEntry', req);
        const { data } = await fetchData(url, method, req.body);

        if (data.ok)
            res.redirect(`/detail/${req.body.entryID}`);

        else {

            if (data.errors) {
                let err = {};
                const e = data.errors;

                if (e.title)
                    err.title = e.title.msg;

                if (e.content)
                    err.content = e.content.msg;

                if (e.extract)
                    err.extract = e.extract.msg;

                if (e.image)
                    err.image = e.image.msg;

                res.render('edit', {
                    entry: req.body,
                    msg: err,
                    urlTitle: 'Blog: editar'
                });

            } else
                res.status(500).send({
                    urlTitle: 'Blog: error',
                    msg: `Error en showEdit`,
                    data
                });

        }

    } catch (e) {

        res.status(500).send({
            urlTitle: 'Blog: error',
            msg: `Error en showEdit: ${e}`
        });

    }
};


module.exports = {
    getEntries,
    searchEntries,
    searchEntriesByEmail,
    getEntryByID,
    showEdit,
    editEntry,
    showNew,
    createEntry
}