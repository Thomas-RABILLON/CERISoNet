import { Request, Response, NextFunction } from "express";
import { PostReqCreation } from "../types/post.model";
import config from "../config/config";
import { MongoClient, ObjectId } from "mongodb";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.isConnected && req.session?.idUser) {
        next();
    } else {
        res.status(401).json({
            message: 'Non connecté'
        });
    }
};

const postFormatMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const post: PostReqCreation = req.body;
        if (!post.contenu || post.contenu.trim() === '') {
            res.status(400).json({
                message: 'Contenu du post invalide'
            });
            return;
        }

        if (!post.date || post.date.trim() === '') {
            res.status(400).json({
                message: 'Date du post invalide'
            });
            return;
        }

        if (!post.hour || post.hour.trim() === '') {
            res.status(400).json({
                message: 'Heure du post invalide'
            });
            return;
        }

        if (post.images && (!post.images.url || post.images.url.trim() === '')) {
            res.status(400).json({
                message: 'Image du post invalide'
            });
            return;
        }

        req.body = post;
        next();
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur de traitement du post'
        });
    }
}

const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

const postExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idPost } = req.body;
        const client = await MongoClient.connect(dnsMongoDB);
        const db = client.db();
        const collection = db.collection(config.mongo.POST_COLLECTION);

        const post = await collection.findOne({ _id: new ObjectId(idPost) });
        if (!post) {
            res.status(404).json({
                message: 'Post non trouvé'
            });
            client.close();
            return;
        }

        client.close();
        next();
    } catch (error: any) {
        res.status(500).json({
            message: 'Erreur de traitement du post'
        });
    }
}

export { isAuthenticated, postFormatMiddleware, postExistMiddleware };
