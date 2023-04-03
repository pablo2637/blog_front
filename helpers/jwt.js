const jwt = require('jsonwebtoken');

const generateJwt = (uid, nombre) => {
    return new Promise((resolve, reject) => {
        let payload = { uid, nombre };
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