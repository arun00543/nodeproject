import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSalesorderComponent } from './customer-salesorder.component';

describe('CustomerSalesorderComponent', () => {
  let component: CustomerSalesorderComponent;
  let fixture: ComponentFixture<CustomerSalesorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSalesorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSalesorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
