import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractEmployeeComponent } from './manage-contract-employee.component';

describe('ManageContractEmployeeComponent', () => {
  let component: ManageContractEmployeeComponent;
  let fixture: ComponentFixture<ManageContractEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContractEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContractEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
