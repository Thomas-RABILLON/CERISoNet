import { Component, signal, input } from '@angular/core';
import { Post } from '../../models/post.model';
import { CommentaireComponent } from './commentaire/commentaire';

@Component({
    selector: 'app-post',
    imports: [CommentaireComponent],
    templateUrl: './post.html',
    styleUrl: './post.css',
})
export class PostComponent {
    post = input.required<Post>();
    signalPost = signal<Post>({} as Post);

    ngOnInit(): void {
        this.signalPost.set(this.post());
    }

    likePost(idPost: string) {
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
                this.signalPost.update((post) => {
                    return {
                        ...post,
                        isLikedByUser: isLiked,
                        likes: likes
                    };
                });
            }
        });
    }
}