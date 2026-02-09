import express from "express";
import config from "./config/config";

const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))

app.post('/login', (req, res) => {
    const { username, pwd } = req.body

    console.log('username : ' + username + ', password : ' + pwd)

    res.send('Connecté en avec: username : ' + username + ', password : ' + pwd)
});

const options = {
	key: fs.readFileSync('./ssl/key.pem'),
	cert: fs.readFileSync('./ssl/cert.pem')
};

// app.listen(config.port.HTTP, () => {
// 	console.log('Server is running on port ' + config.port.HTTP);
// });

https.createServer(options, app).listen(config.port.HTTPS, () => {
	console.log('HTTPS => listening on ' + config.port.HTTPS);
});