const express = require('express');
const router = express.Router();

// Controllers
const mainIndexController = require('../controllers/mainController');

router.route('/')
    .get(mainIndexController.homePage)
    .post(mainIndexController.saveJobDescription);

router.route('/thanks')
    .get(mainIndexController.thanksPage)

module.exports = router;
