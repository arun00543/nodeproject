import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShipmentComponent } from './manage-shipment.component';

describe('ManageShipmentComponent', () => {
  let component: ManageShipmentComponent;
  let fixture: ComponentFixture<ManageShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageShipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
