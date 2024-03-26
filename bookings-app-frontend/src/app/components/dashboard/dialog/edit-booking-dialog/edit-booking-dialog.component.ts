import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateBookingPayload } from '../../../../models/api/bookings/update-booking-payload.model';
import { Booking } from '../../../../models/domain/booking.model';
import { ModelConverter } from '../../../../utils/helpers/model-converter.helper';

@Component({
    selector: 'app-edit-booking-dialog',
    templateUrl: './edit-booking-dialog.component.html',
    styleUrls: ['./edit-booking-dialog.component.scss'],
})
export class EditBookingDialogComponent {
    public form: FormGroup = new FormGroup({
        fullname: new FormControl(this.data.fullname, Validators.required),
        roomNumber: new FormControl(this.data.roomNumber, Validators.required),
        range: new FormGroup({
            start: new FormControl(new Date(this.data.checkIn), Validators.required),
            end: new FormControl(new Date(this.data.checkOut), Validators.required),
        }),
    });
    public minDate: Date;

    constructor(
        public dialogRef: MatDialogRef<UpdateBookingPayload>,
        @Inject(MAT_DIALOG_DATA) public data: Booking
    ) {
        this.minDate = new Date();
        this.minDate.setHours(0, 0, 0, 0);
    }

    submit(): void {
        if (this.form.valid) {
            const converted: Booking = new ModelConverter<any, Booking>((a: any): Booking => {
                const {
                    fullname,
                    roomNumber,
                    range: { start, end },
                } = a;

                return {
                    id: this.data.id,
                    fullname,
                    roomNumber,
                    checkIn: Math.floor(new Date(start).getTime() / 1000),
                    checkOut: Math.floor(new Date(end).getTime() / 1000),
                };
            }).convert(this.form.value);

            this.dialogRef.close(converted);
        }
    }
}
