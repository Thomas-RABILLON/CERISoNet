import { Router } from "express";
import { extractHashtags, readyToSend } from "../../utils/postsUtils";
import config from "../../config/config";
import { parseDate } from "../../utils/dateUtils";
import { PostReqCreation } from "../../types/post.model";

const MongoClient = require('mongodb').MongoClient;
const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

const postsRouter = Router();

postsRouter.get('/posts/:low_limit/:high_limit', (req, res) => {
    const mongoPromise = MongoClient.connect(dnsMongoDB);

    mongoPromise.then((client: any) => {
        if (client) {
            const db = client.db();
            const collection = db.collection(config.mongo.POST_COLLECTION);

            return collection.find({}).toArray();
        }
    }).then(async (posts: any[]) => {
        if (posts) {
            const sorted = posts.sort((a: any, b: any) => parseDate(b) - parseDate(a));
            const paginated = sorted.slice(Number(req.params.low_limit), Number(req.params.high_limit));

            res.status(200).json(await readyToSend(paginated));
        } else {
            res.status(500).json({ message: 'Erreur de récupération des posts' });
        }
    }).catch((err: any) => {
        console.error(err);
        res.status(500).json({ message: 'Erreur de récupération des posts' });
    });
});

postsRouter.post('/post', async (req, res) => {
    const post: PostReqCreation = req.body;

    const newPost: any = {
        date: post.date,
        hour: post.hour,
        body: post.contenu,
        createdBy: post.idUser,
        images: post.images,
        likes: 0,
        likedBy: [],
        hashtags: extractHashtags(post.contenu),
        comments: [],
        shared: null
    }

    if (post.images && post.images.url === '') {
        newPost.images = undefined;
    }

    try {
        const client = await MongoClient.connect(dnsMongoDB);
        const db = client.db();
        const collection = db.collection(config.mongo.POST_COLLECTION);

        const result = await collection.insertOne(newPost);
        if (result.acknowledged) {
            newPost._id = result.insertedId;
            const [finalPost] = await readyToSend([newPost]);
            res.status(200).json(finalPost);
        } else {
            res.status(500).json({
                message: 'Erreur d\'insertion du post'
            });
        }
        client.close();
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            message: 'Erreur d\'insertion du post'
        });
    }
});

export default postsRouter;