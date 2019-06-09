const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const moment = require('moment');
const _ = require('lodash');

const {email} = require('../config');

const signToken = require('./auth').signToken;
const User = require('../api/user/userModel');
const aboutController = require('../api/about/aboutController');

exports.signin = (req, res, next) => {
  	let token = signToken(req.user._id);
  	res.json({tokenID: token, user: req.user._id});
};

exports.upSetPass = async (req, res, next) => {

	const user = await User.findOne({email: req.body.userEmail});
	const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
	const password = req.body.password;
	if(user){
		const timeNow = moment();
		if(timeNow.isAfter(user.secreteCodeExp) || req.body.secretCode !== user.secretCode){
			return res.status(422).json({message : "Code is invalid!"});
		} else if(password ){
			if(!strongRegex.test(password.trim())) {
				return res.status(422).json({message : "Password is too weak!"});
			}
			_.merge(user, {password : password.trim()});
			user.save()
				.then(
					saved => res.json({message: "ok"}), 
					err => next(err)
				);
		} else {
			res.status(422).json({message: "Password missing!"})
		}
	}else{
		res.status(400).json("Cannot set password!")
	}
	
};

exports.sendEmail =  async (req, res, next) => {
	
	const emailTo = req.body.userEmail;
	if(!emailTo.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)){
		return res.status(422).json({message: 'Invalid email'});
	}
	const user = await User.findOne({email: emailTo});
	if(user && req.body.forgotPass){
		const emailData = await sendEmailTo(emailTo);
		_.merge(user, emailData);
		const addEmail = {email:emailTo }
		user.save()
			.then(
				saved => res.json( _.merge(emailData,addEmail ) )
				, err => next(err)
			);
	} else if(!user){
		let newUser = {
			email: emailTo
		}
		const emailData = await sendEmailTo(emailTo);
		_.merge(newUser, emailData);
		User.create(newUser)
			.then(async saved => {
				await aboutController.addNew(saved._id).then( null, err => next(err));
				res.json(newUser)}, 
				err => next(err)
			);
	} else {
		// if made it here something is not ok
		// and we don't care if it's a hack or user already exist
		res.status(422).json({message: "Email is already in the system!"});
	}
};

function sendEmailTo(emailTo){

	const tempCode = randomstring.generate(10);
	const expTime = moment().add(3, 'minutes');
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: email.USER,
			pass: email.PASS
		}
	});

	const mailOptions = {
		from: `t blog <${email.USER}@gmail.com>`,	
		to : emailTo,
		subject: "T-Blog email validation code",
		html: `<p>Please use the below code within the specified timeframe</p>
		<br><h3>${tempCode}</h3><br><p>Expiration time:</p> <h4>${expTime.format('LTS')}</h4>`
	}

	//let info =  transporter.sendMail(mailOptions)
	return ({secretCode: tempCode, secreteCodeExp: expTime});	
};
