import { Router } from "express";
import { ObjectId } from "mongodb";
import { extractHashtags } from "../../utils/postsUtils";
import { Post, reqPost, PostImage, PostCommentaire } from "../../types/posts";
import config from "../../config/config";

const MongoClient = require('mongodb').MongoClient;

const postsRouter = Router();

const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

postsRouter.get('/posts/:low_limit/:high_limit', (req, res) => {
    const mongoPromise = MongoClient.connect(dnsMongoDB);

    mongoPromise.then((client: any) => {
        if (client) {
            const db = client.db();
            const collection = db.collection(config.mongo.POST_COLLECTION);

            return collection.find({}).sort({ date: -1 }).limit(Number(req.params.high_limit)).skip(Number(req.params.low_limit)).toArray();
        }
    }).then((posts: any[]) => {
        if (posts) {
            const objectsPosts: Post[] = posts.map(p => ({
                _id: p._id,
                date: p.date,
                hour: p.hour,
                body: p.body,
                createdBy: p.createdBy,
                image: p.image as PostImage,
                likes: p.likes,
                likedBy: p.likedBy,
                hashtags: p.hashtags,
                comments: p.comments as PostCommentaire[],
                shared: p.shared
            }));

            res.status(200).json(objectsPosts);
        } else {
            res.status(500).json({
                message: 'Erreur de récupération des posts'
            });
        }
    }).catch((err: any) => {
        console.error(err);
        res.status(500).json({
            message: 'Erreur de récupération des posts'
        });
    });
});

postsRouter.get('/post/:id', (req, res) => {
    const mongoPromise = MongoClient.connect(dnsMongoDB);

    mongoPromise.then((client: any) => {
        if (client) {
            const db = client.db();
            const collection = db.collection(config.mongo.POST_COLLECTION);

            return collection.find({ _id: new ObjectId(req.params.id) }).toArray();
        }
    }).then((posts: any[]) => {
        if (posts) {
            const objectsPosts: Post[] = posts.map(p => ({
                _id: p._id,
                date: p.date,
                hour: p.hour,
                body: p.body,
                createdBy: p.createdBy,
                image: p.image,
                likes: p.likes,
                likedBy: p.likedBy,
                hashtags: p.hashtags,
                comments: p.comments,
                shared: p.shared
            }));

            res.status(200).json(objectsPosts);
        } else {
            res.status(500).json({
                message: 'Erreur de récupération des posts'
            });
        }
    }).catch((err: any) => {
        console.error(err);
        res.status(500).json({
            message: 'Erreur de récupération des posts'
        });
    });
});

postsRouter.post('/post', (req, res) => {
    const post: reqPost = req.body;

    const hashtags = extractHashtags(post.contenu);

    const newPost: Post = {
        _id: new ObjectId(),
        date: post.date,
        hour: post.hour,
        body: post.contenu,
        createdBy: post.idUser,
        image: post.image,
        likes: 0,
        likedBy: [],
        hashtags: hashtags,
        comments: [],
        shared: post.shared
    }

    console.log(newPost);
    // const mongoPromise = MongoClient.connect(dnsMongoDB);

    // mongoPromise.then((client: any) => {
    //     if (client) {
    //         const db = client.db();
    //         const collection = db.collection(config.mongo.POST_COLLECTION);

    //         return collection.insertOne(req.body);
    //     }
    // }).then((post: any) => {
    //     if (post) {
    //         res.status(200).json(post);
    //     } else {
    //         res.status(500).json({
    //             message: 'Erreur d\'insertion du post'
    //         });
    //     }
    // }).catch((err: any) => {
    //     console.error(err);
    //     res.status(500).json({
    //         message: 'Erreur d\'insertion du post'
    //     });
    // });
});

export default postsRouter;