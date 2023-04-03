const { fetchData } = require('../helpers/fetchData');
const { getURLs } = require('../configs/getURLs');

const { generateJwt } = require('../helpers/jwt');

const {
    setUserCookie,
    setUserToken,
    getUserDataCookie } = require('../helpers/cookies');


const loginUser = async (req, res) => {

    try {

        const { url, method } = getURLs('loginUser', req);

        const { data } = await fetchData(url, method, req.body);

        if (data.ok) {
            const token = await generateJwt(data.id, data.nombre);

            const user = data.user;
            user.email = req.body.email;

            await setUserCookie(req, res, user);
            await setUserToken(req, res, token);

            await redirectUser(req, res);

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
        console.log(e)
        res.status(500).render('index', {
            urlTitle: 'Blog: entradas',
            msg: `Error en getEntries: ${e}`
        });

    }
};


const redirectUser = async (req, res) => {
    const { rol } = await getUserDataCookie(req, res);

    if (rol == 'admin')
        res.redirect('/blog');
        
    else
        res.redirect('/blog');

};


module.exports = {
    loginUser,
    redirectUser
}