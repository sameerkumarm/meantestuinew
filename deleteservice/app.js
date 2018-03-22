//./express-server/app.js
import express from 'express';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import SourceMapSupport from 'source-map-support';
import bb from 'express-busboy';
import fs from 'fs';
//import routes
//import routes from './routes';
import routes from './service';
//define our app using express
const app = express();

function readJSONFile(filename, callback) {
	console.log("Reading file");
	fs.readFile(filename, (err, data) => {
		console.log("File read callback");
		if (err) {
			console.log("File read callback");
			callback(err);
			return;
		}
		try {
			callback(null, JSON.parse(data));
		} catch (exception) {
			callback(exception);
		}
	});
}
//allow-cors
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	// allow preflight
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

//express-busboy to parse multipart/form-data and x-www-form-urlencoded both
bb.extend(app);




//configure app
app.use(logger('dev'));

//set the port
const port = process.env.PORT || 3001;

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/admin', {
	useMongoClient: true,
});

//add Source Map Support
SourceMapSupport.install();

app.use('/api', router);
app.use('/build',express.static(path.join(__dirname, '/build')));
app.get('/', (req,res) => {
	return res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/fields', (req, res) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  readJSONFile('fields.json', (err, data) => {
    if (err) {
      console.error(err);
    }
    setTimeout(() => {
      res.json(data);
    }, 1500);
  });
});

//catch 404
app.use((req, res, next) => {
	res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});



//start the server
app.listen(port,() => {
	console.log(`App Server Listening at ${port}`);
});