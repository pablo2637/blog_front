const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/media/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.');
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension[extension.length - 1]}`;

        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});


const upload = multer({ storage: storage }).single('imageFile');


module.exports = { upload };