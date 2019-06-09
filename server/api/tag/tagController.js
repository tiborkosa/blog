const Tag = require('./tagModel');
const arrayDifference = require('../../util/arrayDifference');

exports.getMostPopular = async _ => {
	return Tag
		.find({})
		.limit(10)
		.sort({'value': -1})
		.select({name: 1, value: 1, _id: 0})
		.exec();
};

exports.insertUpdateTag = async arr => {
	const tagFound  = await Tag.find({'name': { $in: arr }})
	const existing = [];
	if(tagFound){
		await tagFound.forEach( async doc => {
			existing.push(doc.name);
			doc.value++;
			await doc.save().then(null, err => console.log(err))
		});
	}
	
	const toBeInserted = arrayDifference(arr, existing);
	await toBeInserted.forEach( async el => {
		await Tag.create({name: el, value: 1}).then(null, err => console.log(err));
	});
}

exports.decremenTagVal = arr => {
	Tag.find({'name': { $in: arr }}).then( docs => {
		docs.forEach( async doc => {
			doc.value--;
			await doc.save().then(null, err => console.log(err))
		});
	})
}
