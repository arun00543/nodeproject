import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSwipeEntryComponent } from './add-swipe-entry.component';

describe('AddSwipeEntryComponent', () => {
  let component: AddSwipeEntryComponent;
  let fixture: ComponentFixture<AddSwipeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSwipeEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSwipeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
