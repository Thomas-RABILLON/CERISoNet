import { ObjectId } from "mongodb";

interface reqPost {
    idUser: number;
    contenu: string;
    image: PostImage;
    date: string;
    hour: string;
    shared: ObjectId;
}

interface PostImage {
    url: string;
    title: string;
}

interface PostCommentaire {
    commentedBy: number;
    text: string;
    date: string;
    hour: string;
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
    comments: PostCommentaire[];
    shared: ObjectId;
}

export type { reqPost, Post, PostCommentaire, PostImage };