import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { UpdateBookingPayload } from '../../../../models/api/bookings/update-booking-payload.model';

@Component({
    selector: 'app-edit-booking-dialog',
    templateUrl: './edit-booking-dialog.component.html',
    styleUrls: ['./edit-booking-dialog.component.scss'],
})
export class EditBookingDialogComponent {
    public form: FormGroup = new FormGroup({
        fullname: new FormControl(''),
        roomNumber: new FormControl(''),
        range: new FormGroup({
            start: new FormControl(new Date()),
            end: new FormControl(new Date()),
        }),
    });

    public minDate: Date;

    constructor(public dialogRef: MatDialogRef<UpdateBookingPayload>) {
        this.minDate = new Date();
        this.minDate.setHours(0, 0, 0, 0);
    }

    submit(): void {
        console.log('submit');
        if (this.form.valid) {
            const {
                fullname,
                roomNumber,
                range: { start, end },
            } = this.form.value;

            this.dialogRef.close({
                fullname,
                roomNumber,
                checkIn: new Date(start).getTime(),
                checkOut: new Date(end).getTime(),
            });
        }
    }
}
