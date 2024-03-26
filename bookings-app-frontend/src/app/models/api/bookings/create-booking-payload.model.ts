import { Booking } from '../../domain/booking.model';

export type CreateBookingPayload = Omit<Booking, 'id'>;
