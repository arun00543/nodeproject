import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSwipeEntryComponent } from './manage-swipe-entry.component';

describe('ManageSwipeEntryComponent', () => {
  let component: ManageSwipeEntryComponent;
  let fixture: ComponentFixture<ManageSwipeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSwipeEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSwipeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
