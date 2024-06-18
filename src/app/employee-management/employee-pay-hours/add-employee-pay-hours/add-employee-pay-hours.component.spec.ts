import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeePayHoursComponent } from './add-employee-pay-hours.component';

describe('AddEmployeePayHoursComponent', () => {
  let component: AddEmployeePayHoursComponent;
  let fixture: ComponentFixture<AddEmployeePayHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeePayHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeePayHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
