import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { filter, finalize, Observable, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/domain/booking.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BookingService } from '../../services/booking.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateBookingDialogComponent } from './dialog/create-booking-dialog/create-booking-dialog.component';
import { EditBookingDialogComponent } from './dialog/edit-booking-dialog/edit-booking-dialog.component';
import { DeleteBookingDialogComponent } from './dialog/delete-booking-dialog/delete-booking-dialog.component';
import { CreateBookingPayload } from '../../models/api/bookings/create-booking-payload.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    public displayedColumns: string[] = ['id', 'fullname', 'roomNumber', 'checkIn', 'checkOut', 'actions'];

    public dataSource: MatTableDataSource<Booking> = new MatTableDataSource<Booking>();

    public isLoading: boolean = false;

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    public datepicker: FormGroup = new FormGroup({
        range: new FormGroup({
            from: new FormControl(null),
            to: new FormControl(null),
        }),
    });

    constructor(
        private dialog: MatDialog,
        private authService: AuthService,
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        this.reloadData().subscribe();
        this.datepicker
            .get('range')
            ?.valueChanges.pipe(
                filter(({ from, to }) => from && to),
                switchMap(({ from, to }): Observable<Booking[]> => {
                    const fromTimestamp: number = Math.floor(new Date(from).getTime() / 1000);
                    const toTimestamp: number = Math.floor(new Date(to).getTime() / 1000);
                    return this.reloadData(fromTimestamp, toTimestamp);
                })
            )
            .subscribe();
    }

    public ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator ?? null;
    }

    public logout(): void {
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
                switchMap((createBookingPayload: CreateBookingPayload) => {
                    return this.bookingService.createOne(createBookingPayload);
                })
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
                switchMap(({ id, ...updateBookingPayload }: Booking) =>
                    this.bookingService.updateOne(id, updateBookingPayload)
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

    private reloadData(from?: number, to?: number): Observable<Booking[]> {
        this.isLoading = true;
        return this.bookingService.getMany({ from, to }).pipe(
            tap((bookings: Booking[]): void => {
                console.log('the bookings', bookings);
                this.isLoading = false;
                this.dataSource.data = bookings;
            })
        );
    }
}
