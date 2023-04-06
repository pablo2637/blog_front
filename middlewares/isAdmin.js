const { getUserDataCookie } = require('../helpers/cookies');


const isAdmin = async (req, res, next) => {

    const user = await getUserDataCookie(req, res);

    if (user) {

        if (user.rol == 'admin')
            next();
            
        else
            res.redirect('/blog');

    } else res.redirect('/');

};


const isNotAdmin = async (req, res, next) => {

    const user = await getUserDataCookie(req, res);

    if (user) {

        if (user.rol == 'user')
            next();
        else
            res.redirect('/admin');

    } else res.redirect('/');

};


module.exports = {
    isAdmin,
    isNotAdmin
}