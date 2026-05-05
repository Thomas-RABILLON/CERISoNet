import { Component, input } from '@angular/core';
import { Post } from '../../models/post.model';
import { CommentaireComponent } from './commentaire/commentaire';

@Component({
    selector: 'app-post',
    imports: [CommentaireComponent, PostComponent],
    templateUrl: './post.html',
    styleUrl: './post.css',
})
export class PostComponent {
    post = input.required<Post>();

    likePost(idPost: number) {
        fetch('/api/post/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPost: idPost
            })
        }).then(async (response) => {
            if (response.ok) {
                const { isLiked, likes } = await response.json();
                this.post().isLikedByUser = isLiked;
                this.post().likes = likes;
            }
        });
    }
}