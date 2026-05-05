import { ObjectId } from "mongodb";
import { User } from "./user.model";

interface PostReqCreation {
    contenu: string;
    images: PostImage;
    date: string;
    hour: string;
    shared: Post | ObjectId | null;
}

interface PostImage {
    url: string;
    title: string;
}

interface PostCommentaire {
    commentedBy: User | number;
    text: string;
    date: string;
    hour: string;
}

interface Post {
    _id: ObjectId;
    date: string;
    hour: string;
    body: string;
    createdBy: User;
    images: PostImage;
    likes: number;
    likedBy: number[];
    hashtags: string[];
    comments: PostCommentaire[];
    shared: Post;
    isLikedByUser: boolean;
}

interface PostCreation {
    date: string;
    hour: string;
    body: string;
    createdBy: number;
    images: PostImage | undefined;
    likes: number;
    hashtags: string[];
}

export type { PostReqCreation, Post, PostCommentaire, PostImage, PostCreation };