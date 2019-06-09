const Like = require('./likeModel');

exports.post = (req, res, next) => {
    const like = new Like({
        userid: req.user._id,
        blogid: req.body.blogid
    });
    like.save().then( 
        like => res.json(res), 
        err => next(err)
    );
}
// used internally
exports.getOneLike = (userId, blogId) => {
    Like.findOne({userid : userId, blogid: blogId})
        .then( like => like, err => null);
}

exports.delete = (req, res, next) => {
    Like.deleteOne({blogid:req.params.id, userid: req.user._id})
        .then(
            removed => res.json(res), 
            err => next(err)
        );
}