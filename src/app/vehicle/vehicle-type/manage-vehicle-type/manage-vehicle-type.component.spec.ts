import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVehicleTypeComponent } from './manage-vehicle-type.component';

describe('ManageVehicleTypeComponent', () => {
  let component: ManageVehicleTypeComponent;
  let fixture: ComponentFixture<ManageVehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVehicleTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
