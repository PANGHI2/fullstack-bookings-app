import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
    public email: string = '';
    public password: string = '';

    constructor(private authenticationService: AuthService) {}

    public login(): void {
        console.log(`Trying login with email:${this.email} password:${this.password}`);

        const loginRequest: LoginRequest = {
            email: this.email,
            password: this.password,
        };

        this.authenticationService.login(loginRequest).subscribe();
    }
}
