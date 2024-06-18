import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeWeeklyWagesComponent } from './manage-employee-weekly-wages.component';

describe('ManageEmployeeWeeklyWagesComponent', () => {
  let component: ManageEmployeeWeeklyWagesComponent;
  let fixture: ComponentFixture<ManageEmployeeWeeklyWagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmployeeWeeklyWagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmployeeWeeklyWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
