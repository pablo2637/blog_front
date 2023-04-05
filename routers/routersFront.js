const express = require('express');
const router = express.Router();

const { isNotAdmin } = require('../middlewares/isAdmin');

const {
    getEntries,
    searchEntries,
    searchEntriesByEmail,
    getEntryByID } = require('../controllers/controllerFront');


router.get('/', (req, res) => {
    res.render('index', { urlTitle: 'Blog', user: '' });
});


router.get('/blog', [
    isNotAdmin
], getEntries);


router.get('/detail/:entryID', [
    isNotAdmin
], getEntryByID);


router.post('/search/', [
    isNotAdmin
], searchEntries);


router.get('/email/:email', [
    isNotAdmin
], searchEntriesByEmail);


module.exports = router