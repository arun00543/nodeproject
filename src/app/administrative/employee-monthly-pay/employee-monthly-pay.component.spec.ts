import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMonthlyPayComponent } from './employee-monthly-pay.component';

describe('EmployeeMonthlyPayComponent', () => {
  let component: EmployeeMonthlyPayComponent;
  let fixture: ComponentFixture<EmployeeMonthlyPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMonthlyPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMonthlyPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
