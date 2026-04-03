import { User } from "./user.model";

interface PostImage {
    url: string;
    title: string;
}

interface PostCommentaire {
    commentedBy: User;
    text: string;
    date: string;
    hour: string;
}

interface PostCreation {
    idUser: number;
    contenu: string;
    images: PostImage;
    date: string;
    hour: string;
}

interface Post {
    _id: string;
    date: string;
    hour: string;
    body: string;
    createdBy: User;
    images: PostImage;
    likes: number;
    likedBy: number[];
    hashtags: string[];
    comments: PostCommentaire[];
    shared: Post | undefined;
}

export type { Post, PostCommentaire, PostImage, PostCreation };
