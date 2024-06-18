import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadFollowupComponent } from './add-lead-followup.component';

describe('AddLeadFollowupComponent', () => {
  let component: AddLeadFollowupComponent;
  let fixture: ComponentFixture<AddLeadFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeadFollowupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
