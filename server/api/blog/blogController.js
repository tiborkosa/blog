const Blog = require('./blogModel');
const {getOneLike} = require('./like/likeController');
const _ = require('lodash');

const categoryController = require('../category/categoryController');
const arrayDifference = require('../../util/arrayDifference');

const aboutController = require('../about/aboutController');
const deleteImage = require('./imageUpload/imageController').deleteFiles;
const tagController = require('../tag/tagController');

exports.params = (req, res, next, id) => {
    Blog.findById(id)
        .populate('author',{"_id":1,"image":1,"username":1})
        .exec()
        .then( blog => {
            if(!blog){
                res.status(400).json('No blog with this id!');
            } else {
                req.blog = blog;
                next();
            }
        }, err => {
            next(err);
        }
    );
}
  
exports.getOne = async (req, res, next) => {
    let blog = req.blog;
    if(req.user){
        let like =  await getOneLike(req.user._id, blog._id);
        if(like){
            blog.isLiked = true;
        } 
    }
    console.log(blog)
    res.json({blogData: blog});
}  

exports.getMyBlogs = (req, res, next) => {
    const user = req.user._id;
    
    Blog.aggregate([
        {
            $match:{
                author: user
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },{
            "$unwind":"$author",
        },{
            $lookup:{
                from: 'comments',
                localField: '_id',
                foreignField: 'blogid',
                as: 'blogz'
            }
        },{
            $lookup:{
                from: 'likes',
                localField: '_id',
                foreignField: 'blogid',
                as: 'likez'
            }
        },{
            $project:{
                _id:1,
                desc: 1,
                create_date: 1,
                update_date: 1,
                published: 1,
                title: 1,
                image: 1,
                "author._id":1,
                "author.image":1,
                "author.username":1,
                numComments: {$size:"$blogz"},
                numLikes: {$size: "$likez"}
            }   
        }], (err, blogList) => {
            if(err) next(err)
            else {
                res.json({blogs: blogList});
            }
        }
    );
}
/*
 *  Getting all the short blogs for the main page 
 * */
exports.get = async (req, res, next) => {
    let data = {};
    await Blog.aggregate([
        {
            $lookup:{
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },{
            "$unwind":"$author",
        },{
            $lookup:{
                from: 'comments',
                localField: '_id',
                foreignField: 'blogid',
                as: 'blogz'
            }
        },{
            $lookup:{
                from: 'likes',
                localField: '_id',
                foreignField: 'blogid',
                as: 'likez'
            }
        },{
            $project:{
                _id:1,
                desc: 1,
                create_date: 1,
                update_date: 1,
                published: 1,
                date:1,
                title: 1,
                image: 1,
                "author._id":1,
                "author.image":1,
                "author.username":1,
                numComments: {$size:"$blogz"},
                numLikes: {$size: "$likez"}
            }   
        }], (err, blogList) => {
            if(err) next(err)
            else {
                data.blogs = blogList;
            }
        }
    );
    await categoryController
        .get()
        .then(
            cats => {
                data.categories = cats;
            }, 
            e => next(e)
    );
    await aboutController
        .getForMain()
        .then(
            about => {
                data.about = about;
            },
            e => next(e)
        );
     await tagController
         .getMostPopular()
         .then(tags => data.tags = tags,e => console.log(e));
    
    res.json(data);
}
exports.put = async (req, res, next) => {

    if(req.body.author !== req.user._id.toString()){
        return res.status(400).json("Not authorized to update!");
    }
    
    if(req.body.deletedFiles && req.body.deletedFiles.length > 0){
        await deleteImage(req.body.deletedFiles);
    }
    const oldTags = arrayDifference(req.blog.tags, req.body.tags);
    const newTags = arrayDifference(req.body.tags, req.blog.tags);
    await tagController.insertUpdateTag(newTags);
    await tagController.decremenTagVal(oldTags);
    
    let blog = req.blog;
    let updatedBlog = req.body;
    _.merge(blog, updatedBlog);

    blog.save( (err, saved) => {
        if(err){
            next(err);
        } else {
            res.json({message: "ok"});
        }
    })
}
exports.post = async ( req, res, next ) => {

    if(req.body.author !== req.user._id.toString()){
        return res.status(400).json("Not authorized to post!");
    }

    await tagController.insertUpdateTag(req.body.tags);
    
    let newBlog = req.body;
    Blog.create(newBlog)
		.then( (blog) => {
			res.json({message: "ok"});
		}, (err) => {
			next(err);
		});
}
exports.delete = async (req, res, next) => {
    if(req.blog.author._id.toString() !== req.user._id.toString()){
        return res.status(400).json("Not authorized to delete!");
    }

    await tagController.insertUpdateTag(req.blog.tags);

    req.blog.remove( (err, removed) => {
        if( err ) next(err);
        else res.json(removed._id);
    });
}
