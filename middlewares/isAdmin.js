const { getUserDataCookie } = require('../helpers/cookies');

const { renewToken } = require('../helpers/jwt');


const isAdmin = async (req, res, next) => {

    try {


        await renewToken(req, res);

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'admin')
            res.redirect('/blog');

        else
            next();

    } catch (e) {
        res.redirect('/user/login');

    }

};


const isNotAdmin = async (req, res, next) => {

    try {

        await renewToken(req, res);

        const user = await getUserDataCookie(req, res);

        if (user.rol != 'user')
            res.redirect('/admin');

        else
            next();

    } catch (e) {
        res.redirect('/user/login');

    }

};


module.exports = {
    isAdmin,
    isNotAdmin
}