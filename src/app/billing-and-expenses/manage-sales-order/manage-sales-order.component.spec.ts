import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalesOrderComponent } from './manage-sales-order.component';

describe('ManageSalesOrderComponent', () => {
  let component: ManageSalesOrderComponent;
  let fixture: ComponentFixture<ManageSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSalesOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
