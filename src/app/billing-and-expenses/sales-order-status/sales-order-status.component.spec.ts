import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderStatusComponent } from './sales-order-status.component';

describe('SalesOrderStatusComponent', () => {
  let component: SalesOrderStatusComponent;
  let fixture: ComponentFixture<SalesOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
