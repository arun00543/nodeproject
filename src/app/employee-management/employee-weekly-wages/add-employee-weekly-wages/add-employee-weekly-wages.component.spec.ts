import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeWeeklyWagesComponent } from './add-employee-weekly-wages.component';

describe('AddEmployeeWeeklyWagesComponent', () => {
  let component: AddEmployeeWeeklyWagesComponent;
  let fixture: ComponentFixture<AddEmployeeWeeklyWagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeWeeklyWagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeWeeklyWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
