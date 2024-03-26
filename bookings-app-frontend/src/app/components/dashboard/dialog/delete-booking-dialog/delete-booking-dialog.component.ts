import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-booking-dialog',
    templateUrl: './delete-booking-dialog.component.html',
    styleUrls: ['./delete-booking-dialog.component.scss'],
})
export class DeleteBookingDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteBookingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number
    ) {}
}
