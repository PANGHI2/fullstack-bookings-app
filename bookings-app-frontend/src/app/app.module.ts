import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { HttpResponseInterceptor } from './interceptors/http-response-interceptor.service';
import { HttpRestAuthInterceptor } from './interceptors/http-rest-auth.interceptor';
import { EditBookingDialogComponent } from './components/dashboard/dialog/edit-booking-dialog/edit-booking-dialog.component';
import { CreateBookingDialogComponent } from './components/dashboard/dialog/create-booking-dialog/create-booking-dialog.component';
import { DeleteBookingDialogComponent } from './components/dashboard/dialog/delete-booking-dialog/delete-booking-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        EditBookingDialogComponent,
        CreateBookingDialogComponent,
        DeleteBookingDialogComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatNativeDateModule,
        MatTableModule,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpRestAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
