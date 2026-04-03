import { Pool } from "pg";
import { User } from "../types/user.model";
import config from "../config/config";

const pool = new Pool({
    user: config.postgres.USER,
    host: config.postgres.HOST,
    database: config.postgres.DB,
    password: config.postgres.MDP,
    port: config.postgres.PORT
});

export const getUserById = async (id: number): Promise<User> => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM fredouil.compte WHERE id = $1', [id]);
        client.release();

        const user: User = {
            id: result.rows[0].id,
            mail: result.rows[0].mail,
            pseudo: result.rows[0].pseudo,
            nom: result.rows[0].nom,
            prenom: result.rows[0].prenom,
            avatar: result.rows[0].avatar,
            statut_connexion: result.rows[0].statut_connexion
        };
        return user;
    } catch (error) {
        return {} as User;
    }
}