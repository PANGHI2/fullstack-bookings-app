import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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
        this.authService
            .login({
                email: this.email,
                password: this.password,
            })
            .subscribe();
    }
}
