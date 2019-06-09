const router = require('express').Router();
const formData = require('express-form-data')
const controller = require('./imageController');

router.route('/single_upload').post(formData.parse(),controller.uploadOne);
//router.route('/multi_upload').post(controller.uploadMulti);

module.exports = router;
