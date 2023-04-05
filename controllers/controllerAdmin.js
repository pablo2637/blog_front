const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const fs = require('fs').promises;


const showAdmin = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntries', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            data.data.map(entry => {
                entry.date = new Date(entry.date).toLocaleDateString();
                entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
            });

            res.render('admin/index', {
                urlTitle: 'Blog: Administrador: entradas',
                msg: '',
                entries: data
            });

        }

    } catch (e) {
        console.log('errrorr', e)
        res.status(500).send({
            urlTitle: 'Blog: Administrador: entradas',
            msg: `Error en showAdmin: ${e}`,
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

            res.render('admin/edit', {
                urlTitle: 'Blog: Administrador: editar',
                msg: '',
                entry
            });

        }

    } catch (e) {
        console.log('errrorr', e)
        res.status(500).send({
            urlTitle: 'Blog: Administrador: editar',
            msg: `Error en showEdit: ${e}`
        });

    }
};


const editEntry = async (req, res) => {

    // console.log('req.body', req.body, 'req.file', req.file)

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
            res.redirect('/admin');

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

                res.render('admin/edit', {
                    entry: req.body,
                    msg: err,
                    urlTitle: 'Blog: (Admin) editar'
                });

            } else
                res.status(500).send({
                    urlTitle: 'Blog: Adminitrador: error',
                    msg: `Error en showEdit`,
                    data
                });

        }

    } catch (e) {

        res.status(500).send({
            urlTitle: 'Blog: Adminitrador: error',
            msg: `Error en showEdit: ${e}`
        });

    }
};


module.exports = {
    showAdmin,
    showEdit,
    editEntry
}