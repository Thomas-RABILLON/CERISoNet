import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

interface LoginData {
    email: string;
    password: string;
}

@Component({
    selector: 'app-login',
    imports: [FormField],
    templateUrl: './login.html'
})
export class Login {
    toastr = inject(ToastrService);
    loginModel = signal<LoginData>({
        email: '',
        password: ''
    });
    loginForm = form(this.loginModel, (schemaPath) => {
        required(schemaPath.email, { message: 'Le mail est requis' });
        email(schemaPath.email, { message: 'Le mail est invalide' });

        required(schemaPath.password, { message: 'Le mot de passe est requis' });
    });

    constructor() { }

    onSubmit() {
        const formData = this.loginModel();

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(async (res) => {
            if (res.ok) {
                const { idUser, email, username, lastLogin, isConnected } = await res.json() as {
                    idUser: number;
                    email: string;
                    username: string;
                    lastLogin: string;
                    isConnected: boolean;
                };

                const lastLoginDate = new Date(lastLogin);

                localStorage.setItem('id', idUser.toString());
                localStorage.setItem('email', email);
                localStorage.setItem('username', username);
                localStorage.setItem('lastLogin', lastLogin.toString());
                localStorage.setItem('isConnected', String(isConnected));

                this.toastr.success('Bonjour ' + username + ', dernière connexion : ' + lastLoginDate.toLocaleDateString(), 'Connexion');
                window.location.href = '/home';
            } else if (res.status === 401) {
                const { message } = await res.json() as { message: string };
                this.toastr.error(message, 'Erreur de connexion');
            } else if (res.status === 500) {
                const { message } = await res.json() as { message: string };
                this.toastr.error(message, 'Erreur serveur');
            } else {
                this.toastr.error('Une erreur inconue est survenue', 'Erreur inconnue');
            }
        });
    }
}
