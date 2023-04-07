const jwt = require('jsonwebtoken');

const {
    setUserToken,
    getUserDataCookie,
    setUserCookie } = require('../helpers/cookies');


const generateJwt = (payload) => {

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' },
            (error, token) => {
                if (error) reject({
                    ok: false,
                    msg: 'generateJwt: Error al generar el token.'
                })

                resolve(token);
            }
        );

    })
};


const renewToken = async (req, res) => {

    const user = await getUserDataCookie(req, res);

    const token = await generateJwt(user);

    if (!token)
        return {
            ok: false,
            msg: 'renewToken: renovación del token incorrecta.'
        };

    await setUserCookie(req, res, user);
    await setUserToken(req, res, token);

    return {
        ok: true,
        msg: 'renewToken: renovación del token correcta.'
    };
};


module.exports = {
    generateJwt,
    renewToken
}