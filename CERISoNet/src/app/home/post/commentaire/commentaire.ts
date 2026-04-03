import { Component, input } from '@angular/core';
import { PostCommentaire } from '../../../models/post.model';

@Component({
    selector: 'app-commentaire',
    imports: [],
    templateUrl: './commentaire.html',
    styleUrl: './commentaire.css',
})
export class CommentaireComponent {
    comment = input.required<PostCommentaire>();
}