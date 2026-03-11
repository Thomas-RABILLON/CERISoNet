import { request, Router } from "express";
import crypto, { createHash, createHmac } from "crypto";
import { Connection, Pool } from "pg";
import config from "../../../config/config";

const pool = new Pool({
    user : config.postgres.USER,
    host : config.postgres.HOST,
    database : config.postgres.DB,
    password : config.postgres.MDP,
    port : config.postgres.PORT
});

const LoginRouter = Router();

LoginRouter.post('/', (req, res) => {
    const { email, pwd } = req.body

    console.log(email);
    console.log(pwd);

    pool.connect((err, client, done) => {
        if(err) { 
            console.log('Error connecting to pg server' + err.stack);
            res.sendStatus(500).send('Erreur de connexion à la base de données');
        } 
        else{
            console.log('Connection established / pg db server');
            
            client?.query("SELECT * FROM fredouil.compte WHERE mail = '" + email + "';", (err, result) => {
                if(err){
                    console.log('Erreur d’exécution de la requete' + err.stack);
                    res.sendStatus(500).send('Erreur d’exécution de la requete' + err.stack)
                    return;
                }
                
                const user = result.rows[0];
                if(user != null && user.motpasse == createHash('sha1').update(pwd).digest('hex')) {
                    req.session.isConnected = true;
                    req.session.email = email;
                    req.session.idUser = Number(user.id);
                    req.session.save();
                    
                    res.send('Connecté')
                } else {
                    console.log('Connexion échouée : informations de connexion incorrecte');
                    res.sendStatus(401).send('Connexion échouée : informations de connexion incorrecte')
                }
            });
        }
    });
});

export default LoginRouter;