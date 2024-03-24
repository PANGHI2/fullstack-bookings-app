import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    constructor(private authService: AuthService) {}

    public logout(): void {
      console.log(`Trying logout`);

      this.authService.logout().subscribe();
    }

    public openDialog(dialogType: string): void {
        if (dialogType === 'create') {
        }
    }
}
