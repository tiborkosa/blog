const About = require('./aboutModel');
const _ = require('lodash');

exports.getForMain = async function getAbout(){
    return await About
        .findById("5c9260118faf59c96ca0aaa7")
        .populate('user',{_id:1,first_name:1, last_name:1, username:1, email:1, age:1,image:1})
        .exec()
        .then( 
            about => about, 
            err => err
        );
}
exports.getOne = (req, res, next) => {
    About
        .findOne({"user":req.params.id})
        .populate("user",{_id:0,first_name:1, last_name:1, username:1, email:1, age:1,image:1})
        .exec()
        .then( 
            about => {
                res.json(about)}, 
            e => next(e)
        );
} 
exports.addNew = id => {
    const newAbout = new About({
        user: id
    });
    return newAbout.save();
}
// exports.add = (req, res, next) => {
//     const newAbout = new About({
//         about: req.body.about,
//         user: req.user._id
//     });
//     newAbout
//         .save()
//         .then( 
//             saved => res.json({message: "ok"}), 
//             err => next(err)
//         );
// }
exports.update = (req, res, next) => {
    About.findById(req.params.id)
        .then( about => {
            _.merge(about,req.body);
            about.save((err, saved) => {
                if( err ){
                    next(err);
                } else {
                    res.json({message: "ok"});
                }
            });
        }, err => next(err));
}
