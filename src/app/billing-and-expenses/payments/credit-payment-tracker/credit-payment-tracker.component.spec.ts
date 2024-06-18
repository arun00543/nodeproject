import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentTrackerComponent } from './credit-payment-tracker.component';

describe('CreditPaymentTrackerComponent', () => {
  let component: CreditPaymentTrackerComponent;
  let fixture: ComponentFixture<CreditPaymentTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditPaymentTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditPaymentTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
