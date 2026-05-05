import { Router, Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import config from "../../config/config";
import { io } from "../../index";
import { isAuthenticated } from "../../middleware";
import { getUser, updateConnectionStatus } from "../../database/Postgres.database";
import { User } from "../../types/user.model";

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user: User | null = await getUser(email);
    if (user != null && user.motpasse == createHash('sha1').update(password).digest('hex')) {
        updateConnectionStatus(Number(user.id), 1);

        req.session.isConnected = true;
        req.session.email = email;
        req.session.idUser = Number(user.id);
        req.session.username = user.pseudo;
        req.session.save();

        res.json({
            idUser: Number(user.id),
            email: email,
            username: user.pseudo,
            lastLogin: new Date(),
            isConnected: true,
        });

        io.emit('login', {
            email: email,
            pseudo: user.pseudo
        });
    } else {
        res.status(401).json({
            message: 'Identifiant ou mot de passe incorrecte'
        });
    }
});

authRouter.get('/logout', isAuthenticated, async (req: Request, res: Response) => {
    const idUser = req.session.idUser;

    await updateConnectionStatus(Number(idUser), 0);

    io.emit('user_disconnected', {
        idUser: Number(idUser),
        email: req.session.email,
        isConnected: false,
    });

    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                message: 'Erreur de déconnexion'
            });
        } else {
            res.json({
                message: 'Déconnecté'
            });
        }
    });
});

export default authRouter;