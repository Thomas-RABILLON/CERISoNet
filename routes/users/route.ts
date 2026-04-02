import { Router } from "express";
import { Pool } from "pg";
import config from "../../config/config";

const usersRouter = Router();

const pool = new Pool({
    user: config.postgres.USER,
    host: config.postgres.HOST,
    database: config.postgres.DB,
    password: config.postgres.MDP,
    port: config.postgres.PORT
});

interface User {
    id: number;
    mail: string;
    pseudo: string;
    nom: string;
    prenom: string;
    avatar: string;
    statut_connexion: string;
}

usersRouter.get('/user/:id', (req, res) => {
    const id = req.params.id;

    pool.connect((err, client, done) => {
        if (err) {
            console.log('Error connecting to pg server' + err.stack);
            res.status(500).json({
                message: 'Error connecting to pg server'
            });
        } else {
            client?.query('SELECT * FROM fredouil.compte WHERE id = $1', [id], (err, result) => {
                if (err) {
                    console.log('Error executing query' + err.stack);
                    res.status(500).json({
                        message: 'Error executing query'
                    });
                } else {
                    const user: User = {
                        id: result.rows[0].id,
                        mail: result.rows[0].mail,
                        pseudo: result.rows[0].pseudo,
                        nom: result.rows[0].nom,
                        prenom: result.rows[0].prenom,
                        avatar: result.rows[0].avatar,
                        statut_connexion: result.rows[0].statut_connexion
                    };

                    res.json(user);
                }
            });
        }
    });
});

export default usersRouter;
