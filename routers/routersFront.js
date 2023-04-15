const express = require('express');
const router = express.Router();

const { isNotAdmin } = require('../middlewares/isAdmin');

const { upload } = require('../helpers/uploadImg');

const {
    getEntries,
    searchEntries,
    searchEntriesByEmail,
    getEntryByID,
    showEdit,
    editEntry,
    showNew,
    createEntry } = require('../controllers/controllerFront');


// router.get('/', (req, res) => {
//     res.render('index', { urlTitle: 'Blog', user: '' });
// });


router.get('/', getEntries);


router.post('/', getEntries);


router.get('/detail/:entryID', getEntryByID);


router.get('/edit/:entryID', [
    isNotAdmin
], showEdit);


router.post('/edit', [
    isNotAdmin,
    upload
], editEntry);


router.get('/new', [
    isNotAdmin
], showNew);


router.post('/new', [
    isNotAdmin,
    upload
], createEntry);


router.post('/search', searchEntries);


router.get('/email', searchEntriesByEmail);


router.post('/email', searchEntriesByEmail);


module.exports = router