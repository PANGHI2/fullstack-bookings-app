import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Booking } from '../../../../models/domain/booking.model';
import { ModelConverter } from '../../../../utils/helpers/model-converter.helper';
import { CreateBookingPayload } from '../../../../models/api/bookings/create-booking-payload.model';

@Component({
    selector: 'app-create-booking-dialog',
    templateUrl: './create-booking-dialog.component.html',
    styleUrls: ['./create-booking-dialog.component.scss'],
})
export class CreateBookingDialogComponent {
    public form: FormGroup = new FormGroup({
        fullname: new FormControl('', Validators.required),
        roomNumber: new FormControl('', Validators.required),
        range: new FormGroup({
            start: new FormControl(new Date(), Validators.required),
            end: new FormControl(new Date(), Validators.required),
        }),
    });
    public minDate: Date;

    constructor(public dialogRef: MatDialogRef<CreateBookingDialogComponent>) {
        this.minDate = new Date();
        this.minDate.setHours(0, 0, 0, 0);
    }

    submit(): void {
        if (this.form.valid) {
            const converted: CreateBookingPayload = new ModelConverter<any, CreateBookingPayload>(
                (a: any): CreateBookingPayload => {
                    const {
                        fullname,
                        roomNumber,
                        range: { start, end },
                    } = a;

                    return {
                        fullname,
                        roomNumber,
                        checkIn: Math.floor(new Date(start).getTime() / 1000),
                        checkOut: Math.floor(new Date(end).getTime() / 1000),
                    };
                }
            ).convert(this.form.value);

            this.dialogRef.close(converted);
        }
    }
}
