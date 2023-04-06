const express = require('express');
const router = express.Router();

const { upload } = require('../helpers/uploadImg');

const {
    showAdmin,
    showEdit,
    editEntry,
    deleteEntry,
    getEntryByID } = require('../controllers/controllerAdmin');

const { isAdmin } = require('../middlewares/isAdmin');


router.get('/', [
    isAdmin
], showAdmin);


router.get('/edit/:entryID', [
    isAdmin
], showEdit);


router.post('/edit', [
    isAdmin,
    upload
], editEntry);


router.get('/delete/:entryID', [
    isAdmin
], deleteEntry);


router.get('/detail/:entryID', [
    isAdmin
], getEntryByID);


module.exports = router