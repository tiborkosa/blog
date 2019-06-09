const app = require('./server');
const {PORT} = require('./server/config');

app.listen(PORT);
console.log('server started ');
