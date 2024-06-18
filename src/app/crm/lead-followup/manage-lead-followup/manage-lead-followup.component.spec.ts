import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeadFollowupComponent } from './manage-lead-followup.component';

describe('ManageLeadFollowupComponent', () => {
  let component: ManageLeadFollowupComponent;
  let fixture: ComponentFixture<ManageLeadFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLeadFollowupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLeadFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
