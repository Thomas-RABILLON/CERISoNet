import { ObjectId } from "mongodb";

interface reqPost {
    idUser: number;
    contenu: string;
    image: PostImage;
    date: Date;
}

interface PostImage {
    url: string;
    title: string;
}

interface Post {
    _id: ObjectId;
    date: string;
    hour: string;
    body: string;
    createdBy: number;
    image: PostImage;
    likes: number;
    likedBy: number[];
    hashtags: string[];
    comments: string[];
    shared: ObjectId;
}

export type { reqPost, Post };