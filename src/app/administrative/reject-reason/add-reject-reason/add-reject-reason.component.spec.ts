import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRejectReasonComponent } from './add-reject-reason.component';

describe('AddRejectReasonComponent', () => {
  let component: AddRejectReasonComponent;
  let fixture: ComponentFixture<AddRejectReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRejectReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRejectReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
