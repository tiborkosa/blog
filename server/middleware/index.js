const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

module.exports = (app) => {
		app.use(morgan('dev'));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(bodyParser.json());
		app.use(cors());
		// app.use((req, res, next) => {
		// 	res.header('Access-Control-Allow-Origin','*');// this could be set to my page later
		// 	res.header(
		// 		'Access-Control-Allow-Headers', 
		// 		'Origin,X-Reaquested-With, Content-Type, Accept, Authorization'
		// 	);
		// 	if( req.method === 'OPTIONS'){
		// 		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		// 		return res.status(200).json({});
		// 	}
		// 	next();
		// });
}
