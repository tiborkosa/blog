module.exports = {
	PORT: process.env.PORT,
	logging: false,
	mongo: process.env.MONGO,
	cloud_img : {
		cloud_name: process.env.CLOUD_NAME, 
    	api_key: process.env.API_KEY, 
    	api_secret: process.env.API_SECRET
	}
};
