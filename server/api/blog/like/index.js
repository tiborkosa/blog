const router = require('express').Router();
const controller = require('./likeController');

router.route('/').post(controller.post);
router.route('/:id').delete(controller.delete);

module.exports = router;
