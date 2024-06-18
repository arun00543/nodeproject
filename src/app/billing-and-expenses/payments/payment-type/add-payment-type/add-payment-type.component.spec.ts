import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentTypeComponent } from './add-payment-type.component';

describe('AddPaymentTypeComponent', () => {
  let component: AddPaymentTypeComponent;
  let fixture: ComponentFixture<AddPaymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
