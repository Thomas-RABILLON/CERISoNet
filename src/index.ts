import express from "express";
import config from "./config/config";

import crypto, { createHash, createHmac } from "crypto";

import { Connection, Pool } from "pg";

const pool = new Pool({
    user : config.postgres.USER,
    host : config.postgres.HOST,
    database : config.postgres.DB,
    password : config.postgres.MDP,
    port : config.postgres.PORT
});

const test_mdp = createHash('sha1').update('test').digest('hex');

pool.connect((err, client, done) => {
    if(err) { console.log('Error connecting to pg server' + err.stack); } 
    else{
        console.log('Connection established / pg db server');
        
        client?.query("SELECT * FROM fredouil.compte WHERE id = 7;", (err, result) => {
            if(err){
                console.log('Erreur d’exécution de la requete' + err.stack);
            } else if(result.rows[0] != null && result.rows[0].motpasse == test_mdp) {
                //request.session.isConnected = true; // utilisation des sessions
                console.log(result.rows[0].prenom);
            } else {
                console.log('Connexion échouée : informations de connexion incorrecte');
            }
        });
    }
});



const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))

app.post('/login', (req, res) => {
    const { username, pwd } = req.body

    console.log('username : ' + username + ', password : ' + pwd)

    res.send('Connecté')
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
