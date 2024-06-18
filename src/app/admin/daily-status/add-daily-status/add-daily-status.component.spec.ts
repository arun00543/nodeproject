import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyStatusComponent } from './add-daily-status.component';

describe('AddDailyStatusComponent', () => {
  let component: AddDailyStatusComponent;
  let fixture: ComponentFixture<AddDailyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDailyStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDailyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
