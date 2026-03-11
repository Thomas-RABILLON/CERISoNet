import { request, Router } from "express";
import crypto, { createHash, createHmac } from "crypto";
import { Connection, Pool } from "pg";
import config from "../config/config";

const router = Router();

// router.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));
// router.get('/', (_, res) => res.sendFile('/home/thomas/Documents/AMS/CERISoNet/src/index.html'));

const pool = new Pool({
    user: config.postgres.USER,
    host: config.postgres.HOST,
    database: config.postgres.DB,
    password: config.postgres.MDP,
    port: config.postgres.PORT
});

router.post('/api/login', (req, res) => {
    const { email, password } = req.body

    pool.connect((err, client, done) => {
        if (err) {
            console.log('Error connecting to pg server' + err.stack);
            res.sendStatus(500).send('Erreur de connexion à la base de données');
        } else {
            console.log('Connection established / pg db server');

            client?.query("SELECT * FROM fredouil.compte WHERE mail = '" + email + "';", (err, result) => {
                if (err) {
                    console.log('Erreur d’exécution de la requete' + err.stack);
                    res.sendStatus(500).send('Erreur d’exécution de la requete' + err.stack)
                    return;
                }

                const user = result.rows[0];
                if (user != null && user.motpasse == createHash('sha1').update(password).digest('hex')) {
                    client.query("UPDATE fredouil.compte SET statut_connexion = 1 WHERE id = " + Number(user.id) + ";");

                    req.session.isConnected = true;
                    req.session.email = email;
                    req.session.idUser = Number(user.id);
                    req.session.save();

                    console.log('Connexion établie');
                    res.send({
                        isConnected: true,
                        email: email,
                        idUser: Number(user.id)
                    });
                } else {
                    console.log('Connexion échouée : informations de connexion incorrecte');
                    res.sendStatus(401).send('Connexion échouée : informations de connexion incorrecte')
                }
            });
            done();
        }
    });
});

router.get('/logout', (req, res) => {
    const idUser = req.session.idUser;

    pool.connect((err, client, done) => {
        if (err) {
            console.log('Error connecting to pg server' + err.stack);
            res.sendStatus(500).send('Erreur de connexion à la base de données');
        } else {
            console.log('Connection established / pg db server');

            client?.query("UPDATE fredouil.compte SET statut_connexion = 0 WHERE id = " + Number(idUser) + ";");
            done();
        }
    });

    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session' + err.stack);
            res.sendStatus(500).send('Erreur de déconnexion');
        } else {
            console.log('Session destroyed');
            res.send('Déconnecté');
        }
    });
});

export default router;