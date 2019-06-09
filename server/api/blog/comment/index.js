const router = require('express').Router();
const {authenticate} = require('../../../authenticate/auth')
const controller = require('./commentController');

router.route('/')
    .post(authenticate, controller.post)
    .get(controller.getPaged);
router.route('/:id')
    .put(authenticate, controller.update)
    .delete(authenticate, controller.delete);

module.exports = router;
