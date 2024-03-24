import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createHttpParams, KeyValueObject } from '../utils/helpers';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../config/environment';
import { API_ENDPOINTS } from '../utils/constants';
import { BookingResponse } from '../models/api/bookings/booking-response';
import { GetBookingsParams } from '../models/api/bookings/get-bookings-params';
import { GetAuthUserResponse } from '../models/api/auth/get-auth-user-response';
import { MessageResponse } from '../models/api/message-response';
import { CreateBookingPayload } from '../models/api/bookings/create-booking-payload';
import { UpdateBookingPayload } from '../models/api/bookings/update-booking-payload';

@Injectable({
    providedIn: 'root',
})
export class BookingService {
    constructor(private http: HttpClient) {}

    getAll(params: GetBookingsParams): Observable<BookingResponse[]> {
        const bookingsUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings}`;

        return this.http
            .get<BookingResponse[]>(bookingsUrl, { params: createHttpParams(params as KeyValueObject) })
            .pipe(
                tap((bookingsResponse: BookingResponse[]): void => {
                    console.log(`${bookingsUrl} response:`, bookingsResponse);
                }),
                catchError((error: MessageResponse): Observable<never> => {
                    console.log(`${bookingsUrl} request error: `, error);
                    return throwError(() => error);
                })
            );
    }

    getOne(bookingId: number): Observable<BookingResponse> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http.get<BookingResponse>(bookingUrl).pipe(
            tap((bookingResponse: BookingResponse): void => {
                console.log(`${bookingUrl} response:`, bookingResponse);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${bookingUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    createOne(booking: CreateBookingPayload): Observable<BookingResponse> {
        const bookingsUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings}`;

        return this.http.post<BookingResponse>(bookingsUrl, booking).pipe(
            tap((bookingsResponse: BookingResponse): void => {
                console.log(`${bookingsUrl} response:`, bookingsResponse);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${bookingsUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    updateOne(bookingId: number, booking: UpdateBookingPayload): Observable<BookingResponse> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http.put<BookingResponse>(bookingUrl, booking).pipe(
            tap((bookingsResponse: BookingResponse): void => {
                console.log(`${bookingUrl} response:`, bookingsResponse);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${bookingUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }

    deleteOne(bookingId: number): Observable<void> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http.delete<void>(bookingUrl).pipe(
            tap((): void => {
                console.log(`${bookingUrl} response: success`);
            }),
            catchError((error: MessageResponse): Observable<never> => {
                console.log(`${bookingUrl} request error: `, error);
                return throwError(() => error);
            })
        );
    }
}
