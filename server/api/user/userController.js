const User = require('./userModel');
const {deleteFiles} = require('../blog/imageUpload/imageController');

const _ = require('lodash');

exports.params = (req, res, next, id) => {
	User.findById(id)
		.then( (user) => {
			if(!user){
				res.status(400).json('No user with that id!');
			} else {
				req.user = user;
				next();
			}
		}, (err) => {
			next(err);			
		}
	);
};

exports.get = (req, res, next) => {
	User.find({})
		.then( (users) => {
			res.json(users);
		},
		(err) => {
			next(err);
		}
	);
};

exports.getOne = (req, res, next) => {
	let user = req.user;
	res.json(user);
};

exports.put = (req, res, next) => {
	let user = req.user;
	let update = req.body;
	if(update.removedImages.length > 0){
		deleteFiles(update.removedImages);
	}
	_.merge(user, update);

	user.save( (err, saved) => {
		if( err ){
			next(err);
		} else {
			res.json({message: "ok"});
		}
	});
};

exports.post = (req, res, next) => {
	let newUser = req.body;

	User
		.create(newUser)
		.then( (user) => {
			res.json({message: "ok"});
		}, (err) => {
			next(err);
		});
};

exports.delete = (req, res, next) => {
	req.user.remove( (err, removed) => {
		if( err ){
			next(err);
		} else {
			res.json({message: "ok"});
		}
	});
};
