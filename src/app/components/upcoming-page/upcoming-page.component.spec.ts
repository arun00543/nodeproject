import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingPageComponent } from './upcoming-page.component';

describe('UpcomingPageComponent', () => {
  let component: UpcomingPageComponent;
  let fixture: ComponentFixture<UpcomingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
