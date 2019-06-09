const router = require('express').Router();
const about = require('./about');
const blog = require('./blog');
const user = require('./user');

router.use('/blog', blog);
router.use('/about', about);
router.use('/user', user);


module.exports = router;
