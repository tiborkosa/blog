var router = require('express').Router();
var { verifyUser } = require('./auth');
var controller = require('./controller');

router.post('/signin', verifyUser, controller.signin);
router.post('/sendCode', controller.sendEmail);
router.post('/upSetPass', controller.upSetPass);

module.exports = router;