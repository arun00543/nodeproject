import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayTrackerComponent } from './holiday-tracker.component';

describe('HolidayTrackerComponent', () => {
  let component: HolidayTrackerComponent;
  let fixture: ComponentFixture<HolidayTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
