
const setUserCookie = async (req, res, user) => {

    await res.cookie('userData', user,
        {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });
};


const setUserToken = async (req, res, token) => {

    await res.cookie('userToken', token,
        {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });
};


const getUserDataCookie = async (req, res) => {
    
    const { userData } = req.cookies;
    return userData;
};


const getUserTokenCookie = async (req, res) => {
    
    const { userToken } = req.cookies;
    return userToken;
};


const clearCookies = async (req, res) => {

    await res.clearCookie('userData');
    await res.clearCookie('userToken');
}


module.exports = {
    setUserCookie,
    getUserDataCookie,

    setUserToken,
    getUserTokenCookie,

    clearCookies
}