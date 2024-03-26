import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBookingDialogComponent } from './delete-booking-dialog.component';

describe('DeleteBookingDialogComponent', () => {
    let component: DeleteBookingDialogComponent;
    let fixture: ComponentFixture<DeleteBookingDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeleteBookingDialogComponent],
        });
        fixture = TestBed.createComponent(DeleteBookingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
