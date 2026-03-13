import { Router } from "express";
import { createHash } from "crypto";
import { Pool } from "pg";
import config from "../config/config";

const router = Router();

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
            res.status(500).json({
                message: 'Error connecting to pg server'
            });
        } else {
            console.log('Connection established / pg db server');

            client?.query("SELECT * FROM fredouil.compte WHERE mail = '" + email + "';", (err, result) => {
                if (err) {
                    console.log('Erreur d’exécution de la requete' + err.stack);
                    res.status(500).json({
                        message: 'Erreur d’exécution de la requete'
                    });
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
                    res.json({
                        idUser: Number(user.id),
                        email: email,
                        username: user.pseudo,
                        lastLogin: new Date(),
                        isConnected: true,
                    });
                } else {
                    console.log('Connexion échouée : identifiant ou mot de passe incorrecte');
                    res.status(401).json({
                        message: 'identifiant ou mot de passe incorrecte'
                    });
                }
            });
        }
    });
});

router.get('/api/logout', (req, res) => {
    const idUser = req.session.idUser;

    pool.connect((err, client, done) => {
        if (err) {
            console.log('Error connecting to pg server' + err.stack);
            res.status(500).json({
                message: 'Erreur de connexion à la base de données'
            });
        } else {
            console.log('Connection established / pg db server');

            client?.query("UPDATE fredouil.compte SET statut_connexion = 0 WHERE id = " + Number(idUser) + ";");
        }
    });

    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session' + err.stack);
            res.status(500).json({
                message: 'Erreur de déconnexion'
            });
        } else {
            console.log('Session destroyed');
            res.json({
                message: 'Déconnecté'
            });
        }
    });
});

export default router;