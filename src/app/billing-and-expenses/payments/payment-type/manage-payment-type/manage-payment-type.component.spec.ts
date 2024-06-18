import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentTypeComponent } from './manage-payment-type.component';

describe('ManagePaymentTypeComponent', () => {
  let component: ManagePaymentTypeComponent;
  let fixture: ComponentFixture<ManagePaymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePaymentTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
