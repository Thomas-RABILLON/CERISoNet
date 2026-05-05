import { Router } from "express";
import { extractHashtags, readyToSend } from "../../utils/postsUtils";
import config from "../../config/config";
import { getPosts, getPost, insertPost, isLiked, likePost, unlikePost, commentPost } from "../../database/Mongo.database";
import { PostReqCreation } from "../../types/post.model";
import { io } from "../../index";
import { isAuthenticated, postFormatMiddleware, postExistMiddleware } from "../../middleware";

const MongoClient = require('mongodb').MongoClient;
const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

const postsRouter = Router();

postsRouter.get('/posts/:low_limit/:high_limit/:tri', async (req, res) => {
    const { low_limit, high_limit, tri } = req.params;

    try {
        const posts = await getPosts(Number(low_limit), Number(high_limit), String(tri));
        res.status(200).json(await readyToSend(posts, req.session?.idUser || -1));
    } catch (error) {
        res.status(500).json({ message: 'Erreur de récupération des posts' });
    }
});

postsRouter.post('/post', isAuthenticated, postFormatMiddleware, async (req, res) => {
    const post: PostReqCreation = req.body;

    const newPost: any = {
        date: post.date,
        hour: post.hour,
        body: post.contenu,
        createdBy: req.session?.idUser,
        images: post.images,
        likes: 0,
        likedBy: [],
        hashtags: extractHashtags(post.contenu),
        comments: [],
        shared: post.shared
    }

    try {
        const result = await insertPost(newPost);
        if (result.acknowledged) {
            newPost._id = result.insertedId;
            const [finalPost] = await readyToSend([newPost], req.session?.idUser || -1);
            res.status(200).json(finalPost);
        } else {
            res.status(500).json({
                message: 'Erreur d\'insertion du post'
            });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            message: 'Erreur d\'insertion du post'
        });
    }
});

postsRouter.post('/post/like', isAuthenticated, postExistMiddleware, async (req, res) => {
    const { idPost } = req.body;
    const idUser = req.session.idUser;
    const username = req.session.username;

    try {
        if (await isLiked(idPost, idUser!)) {
            const result = await unlikePost(idPost, idUser!);
            if (result.acknowledged) {
                res.status(200).json({ message: 'Post unliké', isLiked: false, likes: (await getPost(idPost)).likes);
            } else {
                res.status(500).json({ message: 'Erreur de unlike du post' });
            }
        } else {
            const result = await likePost(idPost, idUser!);
            if (result.acknowledged) {
                res.status(200).json({ message: 'Post liké', isLiked: true, likes: (await getPost(idPost)).likes });
                io.emit('post_liked', { username: username, createdBy: (await getPost(idPost)).createdBy });
            } else {
                res.status(500).json({ message: 'Erreur de like du post' });
            }
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur de like du post' });
    }
});

postsRouter.post('/post/comment', isAuthenticated, postExistMiddleware, async (req, res) => {
    const { idPost, comment } = req.body;
    const username = req.session.username;

    try {
        const idUser = req.session.idUser;

        const result = await commentPost(idPost, idUser!, comment);
        if (result.acknowledged) {
            res.status(200).json({ message: 'Commentaire ajouté' });
            io.emit('post_commented', { username: username, createdBy: (await getPost(idPost)).createdBy });
        } else {
            res.status(500).json({ message: 'Erreur d\'ajout du commentaire' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur d\'ajout du commentaire' });
    }
});

export default postsRouter;