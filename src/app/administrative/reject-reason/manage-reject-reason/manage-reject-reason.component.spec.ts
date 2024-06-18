import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRejectReasonComponent } from './manage-reject-reason.component';

describe('ManageRejectReasonComponent', () => {
  let component: ManageRejectReasonComponent;
  let fixture: ComponentFixture<ManageRejectReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRejectReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRejectReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
