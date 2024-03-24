import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
    { path: 'login', component: AuthenticationComponent, canActivate: [noAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
