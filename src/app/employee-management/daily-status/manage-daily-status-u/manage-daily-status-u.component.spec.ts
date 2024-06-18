import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDailyStatusUComponent } from './manage-daily-status-u.component';

describe('ManageDailyStatusUComponent', () => {
  let component: ManageDailyStatusUComponent;
  let fixture: ComponentFixture<ManageDailyStatusUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDailyStatusUComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDailyStatusUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
