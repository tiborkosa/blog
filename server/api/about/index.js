const router = require('express').Router();
const controller = require('./aboutController');
const { authenticate } = require('../../authenticate/auth');

router.route('/:id')
    .get( controller.getOne )
    .put(authenticate, controller.update );

module.exports = router;
