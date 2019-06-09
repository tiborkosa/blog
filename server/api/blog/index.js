const router = require('express').Router();
const blogController = require('./blogController');
const catController = require('../category/categoryController');
const like = require('./like');
const comment = require('./comment');
const imageUpload = require('./imageUpload');
const blogSearch = require('./search');
const { authenticate } = require('../../authenticate/auth');

router.use('/like', authenticate, like);
router.use('/comment', comment);
router.use('/image',authenticate, imageUpload);
router.use('/search', blogSearch);
router.route('/myBlogs').get(authenticate, blogController.getMyBlogs);
router.route('/categories').get(catController.getForNew);

router.param('id', blogController.params)
router.route('/')
    .get( blogController.get )
    .post(authenticate, blogController.post );
router.route('/:id')
    .put(authenticate, blogController.put)
    .delete(authenticate, blogController.delete)
    .get(blogController.getOne);

module.exports = router;