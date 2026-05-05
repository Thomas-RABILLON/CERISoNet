import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { webSocketService } from './web-socket-service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    protected readonly title = signal('CERISoNet');
    isMenuOpen = signal(false);

    webSocket: webSocketService;
    toastr = inject(ToastrService);

    constructor(private _webSocket: webSocketService) {
        this.webSocket = _webSocket;
    }

    ngOnInit(): void {
        this.webSocket.listen('login').subscribe((data: any) => {
            this.toastr.info('Un nouvel utilisateur s\'est connecté : ' + data.pseudo, 'Connexion');
        });

        this.webSocket.listen('post_liked').subscribe((data: any) => {
            if (data.createdBy !== localStorage.getItem('id')) {
                this.toastr.info('Un utilisateur a liké votre post : ' + data.username, 'Like');
            }
        });

        this.webSocket.listen('post_commented').subscribe((data: any) => {
            if (data.createdBy !== localStorage.getItem('id')) {
                this.toastr.info('Un utilisateur a commenté votre post : ' + data.username, 'Commentaire');
            }
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleMenu() {
        this.isMenuOpen.set(!this.isMenuOpen());
    }

    getUserName() {
        return localStorage.getItem('username');
    }

    isLoggedIn() {
        return localStorage.getItem('isConnected') === 'true';
    }

    logout() {
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('lastLogin');
        localStorage.removeItem('isConnected');

        window.location.reload();
    }
}
