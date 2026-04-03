import { getUserById } from "./userUtils";
import { Post, PostImage, PostCommentaire } from "../types/post.model";
import { ObjectId } from "mongodb";
import config from "../config/config";

const MongoClient = require('mongodb').MongoClient;

const dnsMongoDB = 'mongodb://' + config.mongo.HOST + '/' + config.mongo.DB;

const extractHashtags = (text: string): string[] => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    if (matches) {
        return matches.map((match: string) => '#' + match.slice(1));
    }
    return [];
}

const getPostById = async (id: string) => {
    try {
        const client = await MongoClient.connect(dnsMongoDB);
        const db = client.db();
        const collection = db.collection(config.mongo.POST_COLLECTION);

        const res = await collection.findOne({ _id: new ObjectId(id) });
        if (!res) {
            return null;
        }

        const postsArray = await readyToSend([res]);
        return postsArray[0] || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const readyToSend = async (posts: any[]): Promise<Post[]> => {
    await Promise.all(posts.map(async p => {
        p.createdBy = await getUserById(p.createdBy);
        if (p.comments && p.comments.length > 0) {
            await Promise.all(p.comments.map(async (c: any) => {
                c.commentedBy = await getUserById(c.commentedBy);
            }));
        }
        if (p.shared) {
            const id_shared: ObjectId = p.shared;
            p.shared = await getPostById(id_shared.toString());
        }
    }));

    const objectsPosts: Post[] = posts.map(p => ({
        _id: p._id,
        date: p.date,
        hour: p.hour,
        body: p.body,
        createdBy: p.createdBy,
        images: p.images as PostImage,
        likes: p.likes,
        likedBy: p.likedBy,
        hashtags: p.hashtags,
        comments: p.comments as PostCommentaire[],
        shared: p.shared
    }));

    return objectsPosts;
}

export { extractHashtags, readyToSend };