import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractorPaymentComponent } from './add-contractor-payment.component';

describe('AddContractorPaymentComponent', () => {
  let component: AddContractorPaymentComponent;
  let fixture: ComponentFixture<AddContractorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractorPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContractorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
