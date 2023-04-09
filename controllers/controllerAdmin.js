const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const fs = require('fs').promises;

const { getUserDataCookie } = require('../helpers/cookies');

const showAdmin = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntries', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            if (!data.msg.includes('No hay'))
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

        res.status(500).send({
            urlTitle: 'Blog: Administrador: editar',
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


const getEntryByID = async (req, res) => {

    try {

        const { url, method } = getURLs('getEntryByID', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            const entry = data.data[0];

            entry.date = new Date(entry.date).toLocaleDateString();
            entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();

            res.render('admin/detail', {
                urlTitle: 'Blog: Administrador: entrada',
                entry
            });
        }

    } catch (e) {
        res.status(500).send({
            urlTitle: 'Blog: Administrador: entrada',
            msg: `Error en getEntryByID: ${e}`
        });

    }
};


const deleteEntry = async (req, res) => {

    try {

        let imageDelete;

        const { url: urlGE, method: methodGE } = getURLs('getEntryByID', req);
        const { data: dataGE } = await fetchData(urlGE, methodGE);

        if (dataGE.ok)
            imageDelete = dataGE.data[0].image;


        const { url, method } = getURLs('deleteEntry', req);
        const { data } = await fetchData(url, method);

        if (data.ok) {

            try {
                await fs.unlink(`./public/media/${imageDelete}`);

            } catch (error) {

            }

            res.redirect('/admin');

        }

    } catch (e) {

        res.status(500).send({
            urlTitle: 'Blog: Administrador: entradas',
            msg: `Error en deleteEntry: ${e}`,
        });

    }
};



const showChange = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    res.render('admin/changePassword', {
        urlTitle: 'Blog: Administrador: cambiar password',
        error: '',
        user
    });

};


const changePassword = async (req, res, next) => {

    let err = {};
    try {

        if (req.body.newPassword != req.body.passwordR) {
            err.passwordR = 'Los passwords no coinciden, por favor, revísalos.';

            return res.render('admin/changePassword', {
                urlTitle: 'Blog: Administrador: cambiar password error',
                user: req.body,
                error: err
            });
        }

        const { url, method } = getURLs('changePassword', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok) {
            res.redirect('/admin');

        } else {

            if (data.errors) {

                const e = data.errors;

                if (e.oldPassword)
                    err.oldPassword = e.oldPassword.msg;

                if (e.newPassword)
                    err.newPassword = e.newPassword.msg;

            } else if (data.error)
                err.oldPassword = data.error;

            res.render('admin/changePassword', {
                urlTitle: 'Blog: Administrador: cambiar password error',
                user: req.body,
                error: err
            });
        }


    } catch (e) {

        return res.status(500).json({
            ok: false,
            msg: `Error en changePassword: ${e}`
        });

    };
};


module.exports = {
    showAdmin,
    showEdit,
    editEntry,
    deleteEntry,
    getEntryByID,
    changePassword,
    showChange
}