import express from "express";
import config from "./config/config";
import router from "./routes/route";

import session from "express-session";

const MongoDBStore = require("connect-mongodb-session")(session);

const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('/app/CERISoNet/dist/CERISoNet/browser'));
app.use(express.static('/home/thomas/Documents/AMS/CERISoNet/CERISoNet/dist/CERISoNet/browser'));

app.use(session({
	secret: config.mongo.SECRET,
	saveUninitialized: false,
	resave: false,
	store: new MongoDBStore({
		uri: 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB,
		collection: config.mongo.COLLECTION
	}),
	cookie: { maxAge: 24 * 3600 * 1000 }
}));

app.use(router);

const options = {
	key: fs.readFileSync('./ssl/key.pem'),
	cert: fs.readFileSync('./ssl/cert.pem')
};

app.listen(config.port.HTTP, () => {
	console.log('Server is running on port ' + config.port.HTTP);
});

https.createServer(options, app).listen(config.port.HTTPS, () => {
	console.log('HTTPS => listening on ' + config.port.HTTPS);
});
