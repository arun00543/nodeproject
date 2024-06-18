import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeaveRequestComponent } from './manage-leave-request.component';

describe('ManageLeaveRequestComponent', () => {
  let component: ManageLeaveRequestComponent;
  let fixture: ComponentFixture<ManageLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLeaveRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
