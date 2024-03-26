import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/api/auth/login-request.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public email: string = '';
    public password: string = '';

    constructor(private authService: AuthService) {}

    public login(): void {
        console.log(`Trying login with email:${this.email} password:${this.password}`);

        this.authService
            .login({
                email: this.email,
                password: this.password,
            })
            .subscribe();
    }
}
