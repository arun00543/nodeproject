import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedNotificationComponent } from './failed-notification.component';

describe('FailedNotificationComponent', () => {
  let component: FailedNotificationComponent;
  let fixture: ComponentFixture<FailedNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
