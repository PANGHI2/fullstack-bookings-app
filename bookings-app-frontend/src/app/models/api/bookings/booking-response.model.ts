import { Booking } from '../../domain/booking.model';

export interface BookingResponse extends Booking {
    user_id: number;
}
