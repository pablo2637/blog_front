const { getUserDataCookie } = require('../helpers/cookies');

const { renewToken } = require('../helpers/jwt');


const isAdmin = async (req, res, next) => {

    const response = await renewToken(req, res);

    if (!response.ok)
        res.redirect('/login');

    else {

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'admin')
            res.redirect('/blog');
        else
            next();
    }

};


const isNotAdmin = async (req, res, next) => {

    const response = await renewToken(req, res);

    if (!response.ok)
        res.redirect('/');

    else {

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'user')
            res.redirect('/admin');
        else
            next();
    }

};


module.exports = {
    isAdmin,
    isNotAdmin
}