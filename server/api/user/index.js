const router = require('express').Router();
const controller = require('./userController');
const { authenticate } = require('../../authenticate/auth');

router.param('id', controller.params)
router.route('/')
    //.get(authenticate, controller.get ) // add role
    .post( controller.post );
router.route('/:id')
    .put(authenticate, controller.put)
    //.delete(authenticate, controller.delete)
    .get(authenticate, controller.getOne); 

module.exports = router;