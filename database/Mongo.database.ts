import config from "../config/config";
import { parseDate } from "../utils/dateUtils";
import { Post } from "../types/post.model";
import { ObjectId } from "mongodb";

const MongoClient = require('mongodb').MongoClient;
const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

const getPostCollection = async () => {
    const client = await MongoClient.connect(dnsMongoDB);
    const db = client.db();
    const collection = db.collection(config.mongo.POST_COLLECTION);
    client.close();
    return collection;
}

const getPosts = async (low_limit: number, high_limit: number, sort: string) => {
    const collection = await getPostCollection();

    let posts: Post[] = [];
    switch (sort) {
        case "like":
            posts = await collection.find({}).sort({ likes: -1 }).limit(Number(high_limit)).skip(Number(low_limit)).toArray();
            break;
        case "user":
            posts = await collection.find({}).sort({ createdBy: 1 }).limit(Number(high_limit)).skip(Number(low_limit)).toArray();
            break;
        case "date":
            posts = await collection.find({}).toArray();
            break;
        default:
            posts = await collection.find({}).toArray();
            break;
    }

    if (sort === "date") {
        const sorted = posts.sort((a: any, b: any) => parseDate(b) - parseDate(a));
        return sorted.slice(Number(low_limit), Number(high_limit));
    }

    return posts;
}

const getPost = async (idPost: ObjectId) => {
    const collection = await getPostCollection();
    const result = await collection.findOne({ _id: idPost });
    return result;
}

const insertPost = async (post: Post) => {
    const collection = await getPostCollection();
    const result = await collection.insertOne(post);
    return result;
}

const isLiked = async (idPost: ObjectId, idUser: number) => {
    const collection = await getPostCollection();
    const result = await collection.findOne({ _id: idPost, likedBy: idUser });
    return result;
}

const likePost = async (idPost: ObjectId, idUser: number) => {
    const collection = await getPostCollection();
    const result = await collection.updateOne({ _id: idPost }, { $inc: { likes: 1 }, $push: { likedBy: idUser } });
    return result;
}

const unlikePost = async (idPost: ObjectId, idUser: number) => {
    const collection = await getPostCollection();
    const result = await collection.updateOne({ _id: idPost }, { $inc: { likes: -1 }, $pull: { likedBy: idUser } });
    return result;
}

const commentPost = async (idPost: ObjectId, idUser: number, comment: string) => {
    const collection = await getPostCollection();
    const result = await collection.updateOne({ _id: idPost }, { $push: { comments: { commentedBy: idUser, text: comment, date: new Date().toISOString().split('T')[0], hour: new Date().toISOString().split('T')[1] } } });
    return result;
}

export { getPosts, getPost, insertPost, isLiked, likePost, unlikePost, commentPost };