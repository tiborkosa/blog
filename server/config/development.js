module.exports = {
	PORT: 3001,
	logging: true,
	mongo: "mongodb://localhost/t-blog",
	expireTime: '1h',
	secrets : {
		jwt: process.env.JWT || 'secret'
	},
	cloud_img : {
		cloud_name: "", 
    	api_key: "", 
		api_secret: "",
		url: "https://res/cloudinary.com"
	},
	email:{
		USER: "",
		PASS:""
	}
};
