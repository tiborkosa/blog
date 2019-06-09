const Category = require('./categoryModel');

exports.get = async function getCategories(){
    return await Category
        .find()
        .select('-_id name')
        .sort({name:'asc'})
        .then( result => {
            return result;
        }, err => {
            return ("Unable to load categories!");
        })
}
exports.getForNew = (req, res, next) => {
    Category
        .find()
        .select('-_id name')
        .sort({name:'asc'})
        .then( 
        	result => res.json(result), 
        	err => res.status(400).json("Unable to load categories!")
         );
}
