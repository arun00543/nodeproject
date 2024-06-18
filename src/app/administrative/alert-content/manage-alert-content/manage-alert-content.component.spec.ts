import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlertContentComponent } from './manage-alert-content.component';

describe('ManageAlertContentComponent', () => {
  let component: ManageAlertContentComponent;
  let fixture: ComponentFixture<ManageAlertContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAlertContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAlertContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
