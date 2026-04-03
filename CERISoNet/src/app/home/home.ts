import { Component, signal } from '@angular/core';
import { Post, PostCreation } from '../models/post.model';
import { PostComponent } from './post/post';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { form, FormField, required } from '@angular/forms/signals';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

interface PostCreationData {
    contenu: string;
    imageUrl: string;
    imageTitle: string;
}

@Component({
    selector: 'app-home',
    imports: [PostComponent, InfiniteScrollDirective, FormField],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    toastr = inject(ToastrService);
    posts = signal<Post[]>([]);
    nbPosts = 10;
    offset = 0;

    postCreationModel = signal<PostCreationData>({
        contenu: '',
        imageUrl: '',
        imageTitle: ''
    });

    postForm = form(this.postCreationModel, (schemaPath) => {
        required(schemaPath.contenu, { message: 'Le contenu est requis' });
    });

    constructor() {
        fetch('/api/posts/' + this.offset + '/' + this.nbPosts)
            .then(response => response.json())
            .then(data => {
                this.posts.set(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    onScroll() {
        this.offset = this.nbPosts;
        this.nbPosts += 10;

        let nbTry = 0;
        fetch('/api/posts/' + this.offset + '/' + this.nbPosts)
            .then(response => response.json())
            .then(data => {
                this.posts.set([...this.posts(), ...data]);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                this.offset -= this.nbPosts;
                this.nbPosts -= 10;
                if (nbTry < 3) {
                    this.onScroll();
                    nbTry++;
                }
            });
    }

    isLoggedIn() {
        return localStorage.getItem('isConnected') !== null;
    }

    createPost() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        const formData = this.postCreationModel();

        const date = new Date();
        const hour = date.getHours() + ':' + date.getMinutes();

        const post: PostCreation = {
            contenu: formData.contenu,
            images: {
                url: formData.imageUrl,
                title: formData.imageTitle
            },
            date: date.toISOString().split('T')[0],
            hour: hour,
            idUser: Number(localStorage.getItem('id')),
        }

        fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        }).then(async res => {
            if (res.ok) {
                const data = await res.json() as Post;
                this.posts.set([data, ...this.posts()]);

                this.offset += 1;
                this.nbPosts += 1;

                this.toastr.success('Post créé avec succès', 'Succès');
            } else {
                const { message } = await res.json() as { message: string };
                this.toastr.error(message, 'Erreur');
            }
        }).catch(error => {
            console.error('Error creating post:', error);
            this.toastr.error('Erreur lors de la création du post', 'Erreur');
        });

        this.postCreationModel.set({
            contenu: '',
            imageUrl: '',
            imageTitle: ''
        });
    }
}
