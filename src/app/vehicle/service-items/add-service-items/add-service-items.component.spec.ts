import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddServiceItemsComponent } from './add-service-items.component'; 


describe('AddVehicleServiceComponent', () => {
  let component: AddServiceItemsComponent;
  let fixture: ComponentFixture<AddServiceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
