const router = require('express').Router();
const controller = require('./searchController');

router.route('/').get(controller.search);

module.exports = router;
