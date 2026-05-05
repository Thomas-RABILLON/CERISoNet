import { Pool } from "pg";
import config from "../config/config";
import { User } from "../types/user.model";

const pool = new Pool({
    user: config.postgres.USER,
    host: config.postgres.HOST,
    database: config.postgres.DB,
    password: config.postgres.MDP,
    port: config.postgres.PORT
});

const getUser = async (email: string): Promise<User | null> => {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM fredouil.compte WHERE mail = $1`, [email]);
    client.release();

    if (result.rows.length === 0) {
        return null;
    }

    const user: User = {
        id: result.rows[0].id,
        mail: result.rows[0].mail,
        motpasse: result.rows[0].motpasse,
        pseudo: result.rows[0].pseudo,
        nom: result.rows[0].nom,
        prenom: result.rows[0].prenom,
        avatar: result.rows[0].avatar,
        statut_connexion: result.rows[0].statut_connexion
    };
    return user;
}

const updateConnectionStatus = async (idUser: number, status: number) => {
    const client = await pool.connect();
    await client.query(`UPDATE fredouil.compte SET statut_connexion = $1 WHERE id = $2`, [status, idUser]);
    client.release();
}

export { getUser, updateConnectionStatus };