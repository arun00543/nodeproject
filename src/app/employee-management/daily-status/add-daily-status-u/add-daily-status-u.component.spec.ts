import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyStatusUComponent } from './add-daily-status-u.component';

describe('AddDailyStatusUComponent', () => {
  let component: AddDailyStatusUComponent;
  let fixture: ComponentFixture<AddDailyStatusUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDailyStatusUComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDailyStatusUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
