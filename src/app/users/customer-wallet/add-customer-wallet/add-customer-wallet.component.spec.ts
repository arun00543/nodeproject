import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerWalletComponent } from './add-customer-wallet.component';

describe('AddCustomerWalletComponent', () => {
  let component: AddCustomerWalletComponent;
  let fixture: ComponentFixture<AddCustomerWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
