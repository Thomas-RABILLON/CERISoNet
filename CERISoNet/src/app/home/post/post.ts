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
}