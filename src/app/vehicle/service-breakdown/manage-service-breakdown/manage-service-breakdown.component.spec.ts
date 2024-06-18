import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceBreakdownComponent } from './manage-service-breakdown.component';

describe('ManageServiceBreakdownComponent', () => {
  let component: ManageServiceBreakdownComponent;
  let fixture: ComponentFixture<ManageServiceBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageServiceBreakdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageServiceBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
