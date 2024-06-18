import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMachinaryComponent } from './manage-machinary.component';

describe('ManageMachinaryComponent', () => {
  let component: ManageMachinaryComponent;
  let fixture: ComponentFixture<ManageMachinaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMachinaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMachinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
