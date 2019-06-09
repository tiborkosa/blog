const Comment  = require('./commentModel');
const _ = require('lodash');

exports.post = (req, res, next) => {
    const newComment = new Comment({
        userid: req.user._id,
        blogid: req.body.blogid,
        comment: req.body.comment
    });
    newComment.save( (err, saved) => {
        if(err) next(err)
        else getCommentData(res, next, saved._id);
    });
}
exports.delete = (req, res, next) => {
    Comment.deleteOne({ '_id':req.params.id})
        .then(
            deleted => res.json({id:req.params.id, message: 'ok'}), 
            err => next(err)
        );
}
exports.update = (req, res, next) => {
    Comment
        .findById(req.params.id)
        .then( 
            comnt => {
                if(comnt.userid._id.toString() !== req.user._id.toString()){
                    return res.status(403).json("Not authorized to update!");
                }
                comnt.comment = req.body.comment;
                comnt.save( (err, saved) => {
                    if(err) next(err);
                    else getCommentData(res, next, saved._id);
                })
            }, 
            err => next(err))
}
const getCommentData = (res, next, id) => {
    Comment.findOne({
        _id: id
    },{"comment":1})
    .populate('userid',{"image":1, "_id":1, "username":1})
    .exec( (err, data) => {
        if(err) next(err)
        else res.json(data);
    })
}

exports.getPaged = (req, res, next) => {
    Comment.find({
        blogid: req.param('blogid')
    },{"comment":1})
    .populate('userid',{"image":1, "_id":1, "username":1})
    .sort('-date')
    .skip(+req.param('start') * 10)
    .limit(10)
    .exec( (err, data) => {
        if(err) next(err)
        else res.json(data);
    })
}
