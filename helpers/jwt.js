const jwt = require('jsonwebtoken');


const generateJwt = (payload) => {

    return new Promise((resolve, reject) => {
        console.log('payload',payload)

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
}


module.exports = { generateJwt }