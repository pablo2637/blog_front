const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const { generateJwt } = require('../helpers/jwt');

const {
    setUserCookie,
    setUserToken,
    getUserDataCookie,
    clearCookies,
    getUserTokenCookie } = require('../helpers/cookies');


const showLogin = async (req, res) => {

    await clearCookies(req, res);

    res.render('login', {
        urlTitle: 'Blog: login',
        user: '',
        error: ''
    });

};


const showRegister = async (req, res) => {

    await clearCookies(req, res);

    res.render('register', {
        urlTitle: 'Blog: registro',
        user: '',
        error: ''
    });

};


const registerUser = async (req, res, next) => {

    let err = {};
    try {
        console.log('body', req.body)
        if (req.body.password != req.body.passwordR) {
            err.passwordR = 'Los passwords no coinciden, por favor, revísalos.';

            return res.render('register', {
                urlTitle: 'Blog: registro error',
                user: req.body,
                error: err
            });
        }

        const { url, method } = getURLs('postUser', req);

        const { data } = await fetchData(url, method, req.body);
        console.log('data', data)
        if (data.ok) {

            const user = {
                id: data.data[0].userid,
                name: data.data[0].name,
                email: data.data[0].email,
                rol: 'user'
            };

            const token = await generateJwt(user);

            await setUserCookie(req, res, user);
            await setUserToken(req, res, token);

            res.redirect('/blog');

        } else {

            if (data.errors) {

                const e = data.errors;

                if (e.name)
                    err.name = e.name.msg;

                if (e.password)
                    err.password = e.password.msg;

                if (e.email)
                    err.email = e.email.msg;

            }

            res.render('register', {
                urlTitle: 'Blog: registro error',
                user: req.body,
                error: err
            });
        }


    } catch (e) {
        console.log('errorrrr', e)
        return res.status(500).json({
            ok: false,
            msg: `Error en registerUser: ${e}`
        });

    };
};


const loginUser = async (req, res, next) => {

    let error;
    try {

        const { url, method } = getURLs('loginUser', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok) {
            const user = data.user;
            user.email = req.body.email;

            const token = await generateJwt(user);

            await setUserCookie(req, res, user);
            await setUserToken(req, res, token);

            if (user.rol == 'admin')
                res.redirect('/admin');

            else
                res.redirect('/blog');

        } else {

            if (data.errors) {
                if (data.errors.email) error = data.errors.email.msg;

            }
            else error = data.msg;

            res.render('login', {
                urlTitle: 'Blog: login error',
                user: req.body.email,
                error
            });
        }


    } catch (e) {
        console.log('errorrrr', e)
        return res.status(500).json({
            ok: false,
            msg: `Error en loginUser: ${e}`
        });

    };
};


const logoutUser = async (req, res) => {

    try {

        const { url, method } = getURLs('logoutUser', req);

        const user = await getUserDataCookie(req, res);
        req.body = user;

        const { data } = await fetchData(url, method, req.body);

        await clearCookies(req, res);

        res.redirect('/');

    } catch (e) {
        return res.status(500).JSON({
            ok: false,
            msg: `Error en logoutUser: ${e}`
        });

    };
};


const redirectUser = async (req, res) => {

    const { rol } = await getUserDataCookie(req, res);
    console.log('rol', rol)

    if (rol == 'admin')
        res.redirect('/admin');

    else
        res.redirect('/blog');

};


const renewToken = async (req, res) => {

    const user = await getUserTokenCookie(req, res);

    const token = await generateJwt(user.id, user.name);

    await setUserToken(req, res, token);

    return res.status(200).json({
        ok: true,
        msg: 'getRenew: renovación del token correcta.',
        token
    });
};


module.exports = {
    loginUser,
    showLogin,
    redirectUser,
    logoutUser,
    renewToken,
    showRegister,
    registerUser
}