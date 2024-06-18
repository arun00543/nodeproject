import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDailyStatusComponent } from './manage-daily-status.component';

describe('ManageDailyStatusComponent', () => {
  let component: ManageDailyStatusComponent;
  let fixture: ComponentFixture<ManageDailyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDailyStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDailyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
