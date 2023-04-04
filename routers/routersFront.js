const express = require('express');
const router = express.Router();

const {
    getEntries,
    searchEntries,
    searchEntriesByEmail } = require('../controllers/controllerFront');


router.get('/', (req, res) => {
    res.render('index', { urlTitle: 'Blog', user: '' });
});


router.get('/blog', getEntries);


router.post('/search/', searchEntries);


router.get('/email/:email', searchEntriesByEmail);


module.exports = router