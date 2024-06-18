import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageServiceItemsComponent } from './manage-service-items.component'; 


describe('ManageVehicleServiceComponent', () => {
  let component: ManageServiceItemsComponent;
  let fixture: ComponentFixture<ManageServiceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageServiceItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageServiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
