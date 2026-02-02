import express from "express";
import config from "./config/config";
import router from "./interface/routes/route";

const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use('/api', router);

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