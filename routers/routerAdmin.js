const express = require('express');
const router = express.Router();

const { upload } = require('../helpers/uploadImg');

const {
    showAdmin,
    showEdit,
    editEntry,
    deleteEntry,
    getEntryByID,
    changePassword,
    showChange,
    showLogs } = require('../controllers/controllerAdmin');

const { isAdmin } = require('../middlewares/isAdmin');


router.get('/', [
    isAdmin
], showAdmin);

router.post('/', [
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


router.get('/change', [
    isAdmin
], showChange);


router.post('/changePass', [
    isAdmin
], changePassword);


router.post('/logs', [
    isAdmin
], showLogs);

router.get('/logs', [
    isAdmin
], showLogs);


module.exports = router