const Blog = require('../blogModel');

// search blogs by title or tags and categories
exports.search = (req, res, next) => {
    let searchQuery = {}
    if(req.query.searchTag){
        searchQuery = {
            tags: {
                '$in' : [req.query.searchTag]
            }
        } 
    } else if(req.query.searchCat){
        searchQuery = {
            categories: {
                '$in' : [req.query.searchCat]
            }
        } 
    } else if(req.query.searchTitle){
        searchQuery = {
            title :  new RegExp(req.query.searchTitle,"i") 
        };
    }

    Blog.aggregate([
        {
            $match: searchQuery
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
                foreignField: 'blogId',
                as: 'blogz'
            }
        },{
            $lookup:{
                from: 'likes',
                localField: '_id',
                foreignField: 'blogId',
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
        }], (err, data) => {
            if(err) next(err)
            else {
                res.json(data)
            }
        }
    );
}
