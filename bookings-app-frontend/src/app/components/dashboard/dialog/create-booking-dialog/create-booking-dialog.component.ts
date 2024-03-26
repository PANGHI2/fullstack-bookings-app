import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
