module.exports = {
	PORT: 3001,
	logging: true,
	mongo: "mongodb://localhost/t-blog",
	expireTime: '1h',
	secrets : {
		jwt: process.env.JWT || 'secret'
	},
	cloud_img : {
		cloud_name: "ddhjotycm", 
    	api_key: "927882151976859", 
		api_secret: "UQxYnRTlB9YglB0AAJcfxJVH1bo",
		url: "https://res/cloudinary.com"
	},
	email:{
		USER: "tuzpenge.web",
		PASS:"Vviking28"
	}
};
