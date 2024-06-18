import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractorPaymentComponent } from './manage-contractor-payment.component';

describe('ManageContractorPaymentComponent', () => {
  let component: ManageContractorPaymentComponent;
  let fixture: ComponentFixture<ManageContractorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContractorPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContractorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
