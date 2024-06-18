import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomerWalletComponent } from './manage-customer-wallet.component';

describe('ManageCustomerWalletComponent', () => {
  let component: ManageCustomerWalletComponent;
  let fixture: ComponentFixture<ManageCustomerWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCustomerWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCustomerWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
