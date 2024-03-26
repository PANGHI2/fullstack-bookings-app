import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/domain/booking.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BookingService } from '../../services/booking.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditBookingDialogComponent } from './dialog/edit-booking-dialog/edit-booking-dialog.component';
import { DeleteBookingDialogComponent } from './dialog/delete-booking-dialog/delete-booking-dialog.component';
import { filter, switchMap, take } from 'rxjs';
import { CreateBookingDialogComponent } from './dialog/create-booking-dialog/create-booking-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    public displayedColumns: string[] = ['id', 'fullname', 'roomNumber', 'checkIn', 'checkOut', 'actions'];

    public dataSource: MatTableDataSource<Booking> = new MatTableDataSource<Booking>();

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    constructor(
        private dialog: MatDialog,
        private authService: AuthService,
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        this.bookingService.getMany().subscribe((bookings: Booking[]): void => {
            this.dataSource.data = bookings;
        });
    }

    public ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator ?? null;
    }

    public logout(): void {
        console.log(`Trying logout`);

        this.authService.logout().subscribe();
    }

    public openCreateDialog(): void {
        const dialogRef: MatDialogRef<CreateBookingDialogComponent, Booking> =
            this.dialog.open(CreateBookingDialogComponent);

        dialogRef
            .afterClosed()
            .pipe(
                take(1),
                filter(Boolean),
                switchMap((booking: Booking) =>
                    this.bookingService.createOne(
                        this.bookingService.converters.bookingToCreateBookingPayload.convert(booking)
                    )
                )
            )
            .subscribe((createdBooking: Booking): void => {
                this.dataSource.data.unshift(createdBooking);
                this.dataSource.data = [...this.dataSource.data];
            });
    }

    public openEditDialog(booking: Booking): void {
        const dialogRef: MatDialogRef<EditBookingDialogComponent, Booking> = this.dialog.open(
            EditBookingDialogComponent,
            {
                data: booking,
            }
        );

        dialogRef
            .afterClosed()
            .pipe(
                take(1),
                filter(Boolean),
                switchMap((booking: Booking) =>
                    this.bookingService.updateOne(
                        booking.id,
                        this.bookingService.converters.bookingToUpdateBookingPayload.convert(booking)
                    )
                )
            )
            .subscribe((updatedBooking: Booking): void => {
                const index: number = this.dataSource.data.findIndex(
                    (booking: Booking): boolean => booking.id === updatedBooking.id
                );
                if (index !== -1) {
                    this.dataSource.data[index] = updatedBooking;
                    this.dataSource.data = [...this.dataSource.data];
                }
            });
    }

    public openDeleteDialog(bookingId: number): void {
        const dialogRef: MatDialogRef<DeleteBookingDialogComponent, number> = this.dialog.open(
            DeleteBookingDialogComponent,
            {
                data: bookingId,
            }
        );

        dialogRef
            .afterClosed()
            .pipe(
                take(1),
                filter(Boolean),
                switchMap((bookingId: number) => this.bookingService.deleteOne(bookingId))
            )
            .subscribe((): void => {
                this.dataSource.data = this.dataSource.data.filter(
                    (booking: Booking): boolean => booking.id !== bookingId
                );
            });
    }
}
