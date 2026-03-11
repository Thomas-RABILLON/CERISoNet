import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { email, form, FormField, required } from '@angular/forms/signals';

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
    loginModel = signal<LoginData>({
        email: '',
        password: ''
    });
    loginForm = form(this.loginModel, (schemaPath) => {
        required(schemaPath.email, { message: 'Le mail est requis' });
        email(schemaPath.email, { message: 'Le mail est invalide' });

        required(schemaPath.password, { message: 'Le mot de passe est requis' });
    });

    constructor(private http: HttpClient) { }

    onSubmit() {
        const formData = this.loginModel();

        console.log(formData);
        this.http.post('/api/login', formData).subscribe((res) => {
            console.log(res);
        });
    }
}
