import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeePayHoursComponent } from './manage-employee-pay-hours.component';

describe('ManageEmployeePayHoursComponent', () => {
  let component: ManageEmployeePayHoursComponent;
  let fixture: ComponentFixture<ManageEmployeePayHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmployeePayHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmployeePayHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
