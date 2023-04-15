const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const fs = require('fs').promises;

const { getUserDataCookie } = require('../helpers/cookies');

/**
 * @author Pablo
 * @exports Object
 * @namespace controllerAdmin 
 */

/**
 * Definición del tipo entriesData
 * @typedef {Object} entriesData
 * @memberof controllerAdmin
 * @property {String} urlTitle Título de la página
 * @property {String} msg Mensaje con información variable
 * @property {Array} entries Las entradas devueltas por la consulta
 */

/**
 * Definición del tipo entryData
 * @typedef {Object} entryData
 * @memberof controllerAdmin
 * @property {String} urlTitle Título de la página
 * @property {String} msg Mensaje con información variable
 * @property {Object} entry La entrada devuelta por la consulta
 */

/**
 * Definición del tipo User
 * @typedef {Object} User
 * @memberof controllerAdmin
 * @property {String | Number} id ID del usuario
 * @property {String} name Nombre del usuario
 * @property {String} email Email del usuario
 * @property {String} rol Rol del usuario
 */

/**
 * Renderiza en 'index' del administrador las entradas de la base de datos,
 * enviando un objeto :entriesData
 * @memberof controllerAdmin 
 * @method showAdmin
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas    
 * @throws {json} Devuelve el error
 */
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
        console.log(`catchError en showAdmin:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Administrador: entradas',
            msg: `Error en showAdmin: ${e}`,
        });

    };
};


/**
 * Renderiza en 'edit' del administrador la entrada con un id específico,
 * enviando un objeto :entryData
 * @memberof controllerAdmin 
 * @method showEdit
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * params.entryID con el id que se quiere buscar.
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @throws {json} Devuelve el error
 */
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
        console.log(`catchError en showEdit:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Administrador: editar',
            msg: `Error en showEdit: ${e}`
        });

    };
};


/**
 * Recibe la información de la entrada editada para su validación y posterior
 * actualización en la base de datos, luego se redirige al 'index' del administrador.
 * En caso de que la validación devuelva errores, éstos se pasan como un Object
 * en el renderizado de la página 'edit' del administrador.
 * @memberof controllerAdmin 
 * @method editEntry
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
* @throws {json} Devuelve el error
 */
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
                    msg: `Error en editEntry`,
                    data
                });

        }

    } catch (e) {
        console.log(`catchError en editEntry:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Adminitrador: error',
            msg: `Error en editEntry: ${e}`
        });

    };
};


/**
 * Renderiza en 'detail' del administrador la entrada con un id específico,
 * enviando un objeto :entryData
 * @memberof controllerAdmin 
 * @method getEntryByID
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @throws {json} Devuelve el error
 */
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
        console.log(`catchError en getEntryByID:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Administrador: entrada',
            msg: `Error en getEntryByID: ${e}`
        });

    };
};


/**
 * Elimina la entrada con un id específico, luego se redirige al 'index' del administrador.
 * @memberof controllerAdmin 
 * @method deleteEntry
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * params.entryID con el id que se quiere eliminar.
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @throws {json} Devuelve el error
 */
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
        console.log(`catchError en deleteEntry:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Administrador: entradas',
            msg: `Error en deleteEntry: ${e}`,
        });

    };
};


/**
 * Renderiza 'changePassword' del administrador para permitir cambiar la contraseña,
 * se envía un Object :User
 * @memberof controllerAdmin 
 * @method showChange
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas 
 */
const showChange = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    res.render('admin/changePassword', {
        urlTitle: 'Blog: Administrador: cambiar password',
        error: '',
        user
    });

};


/**
 * Recibe los datos para primero validar, y luego, cambiar la contraseña del administrador,
 * si las validaciones son correctas se redirige al 'index'.
 * En caso de errores se devuelven en un Object, y se renderiza el 'changePassword'.
 * @memberof controllerAdmin 
 * @method changePassword
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas, debe contener
 * body.newPassword, body.oldPassword, body.passwordR y body.email.
 * @param {Object} res Es la respuesta que proviene de las rutas 
 * @throws {json} Devuelve el error
 */
const changePassword = async (req, res) => {

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

        if (data.ok)
            res.redirect('/admin');

        else {

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
        console.log(`catchError en changePassword:`, e);

        return res.status(500).json({
            ok: false,
            msg: `Error en changePassword: ${e}`
        });

    };
};


/**
 * Renderiza en 'logs' del administrador las entradas de la base de datos,
 * enviando un objeto :entriesData
 * @memberof controllerAdmin 
 * @method showLogs
 * @async
 * @param {Object} req Es el requerimiento que proviene de las rutas
 * @param {Object} res Es la respuesta que proviene de las rutas    
 * @throws {json} Devuelve el error
 */
const showLogs = async (req, res) => {

    try {

        const { url, method } = getURLs('getLogs', req);

        const { data } = await fetchData(url, method);

        if (data.ok) {

            if (!data.msg.includes('No hay'))
                data.data.map(entry => {

                    entry.date = new Date(entry.date).toDateString();                    
                    entry.time = new Date(entry.date + ' ' + entry.time).toLocaleTimeString();
                    entry.date = new Date(entry.date).toLocaleDateString('es-ES', { weekday: "short", year: "numeric", month: "long", day: "numeric" });
                });

            res.render('admin/logs', {
                urlTitle: 'Blog: Administrador: actividad',
                msg: '',
                entries: data
            });

        }

    } catch (e) {
        console.log(`catchError en showLogs:`, e);

        res.status(500).send({
            urlTitle: 'Blog: Administrador: actividad',
            msg: `Error en showLogs: ${e}`,
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
    showChange,
    showLogs
}