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

}


const loginUser = async (req, res, next) => {

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
        return res.status(500).JSON({
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
    renewToken
}