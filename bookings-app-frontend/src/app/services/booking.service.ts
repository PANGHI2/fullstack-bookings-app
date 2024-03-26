import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createHttpParams } from '../utils/http.utils';
import { map, Observable } from 'rxjs';
import { environment } from '../../config/environment';
import { BookingResponse } from '../models/api/bookings/booking-response.model';
import { GetBookingsParams } from '../models/api/bookings/get-bookings-params.model';
import { CreateBookingPayload } from '../models/api/bookings/create-booking-payload.model';
import { UpdateBookingPayload } from '../models/api/bookings/update-booking-payload.model';
import { Booking } from '../models/domain/booking.model';
import { KeyValueObject } from '../utils/types.utils';
import { API_ENDPOINTS } from '../utils/constants.utils';
import { ModelConverter } from '../utils/helpers/model-converter.helper';

@Injectable({
    providedIn: 'root',
})
export class BookingService {
    constructor(private http: HttpClient) {}

    public converters = {
        bookingResponseToBooking: new ModelConverter<BookingResponse, Booking>(
            ({ user_id, checkIn, checkOut, ...rest }: BookingResponse): Booking => ({
                ...rest,
                checkIn: checkIn * 1000,
                checkOut: checkOut * 1000,
            })
        ),
        bookingToCreateBookingPayload: new ModelConverter<Booking, CreateBookingPayload>(
            ({ checkIn, checkOut, ...rest }: Booking): CreateBookingPayload => ({
                ...rest,
                checkIn: Math.floor(checkIn / 1000),
                checkOut: Math.floor(checkOut / 1000),
            })
        ),
        bookingToUpdateBookingPayload: new ModelConverter<Booking, UpdateBookingPayload>(
            ({ checkIn, checkOut, ...rest }: Booking): UpdateBookingPayload => ({
                ...rest,
                checkIn: Math.floor(checkIn / 1000),
                checkOut: Math.floor(checkOut / 1000),
            })
        ),
    };

    getMany(params?: GetBookingsParams): Observable<Booking[]> {
        const bookingsUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings}`;

        return this.http
            .get<BookingResponse[]>(bookingsUrl, params && { params: createHttpParams(params as KeyValueObject) })
            .pipe(
                map((bookingResponseArr: BookingResponse[]) =>
                    this.converters.bookingResponseToBooking.convert(bookingResponseArr)
                )
            );
    }

    getOne(bookingId: number): Observable<Booking> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http
            .get<BookingResponse>(bookingUrl)
            .pipe(
                map((bookingResponse: BookingResponse) =>
                    this.converters.bookingResponseToBooking.convert(bookingResponse)
                )
            );
    }

    createOne(booking: CreateBookingPayload): Observable<Booking> {
        console.log('trying to create', booking);
        const bookingsUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings}`;

        return this.http
            .post<BookingResponse>(bookingsUrl, booking)
            .pipe(
                map((bookingResponse: BookingResponse) =>
                    this.converters.bookingResponseToBooking.convert(bookingResponse)
                )
            );
    }

    updateOne(bookingId: number, booking: UpdateBookingPayload): Observable<Booking> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http
            .put<BookingResponse>(bookingUrl, booking)
            .pipe(
                map((bookingResponse: BookingResponse) =>
                    this.converters.bookingResponseToBooking.convert(bookingResponse)
                )
            );
    }

    deleteOne(bookingId: number): Observable<void> {
        const bookingUrl: string = `${environment.apiUrl}${API_ENDPOINTS.bookings_$bookingId}`.replace(
            ':bookingId',
            String(bookingId)
        );

        return this.http.delete<void>(bookingUrl);
    }
}
