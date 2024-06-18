import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlertContentComponent } from './add-alert-content.component';

describe('AddAlertContentComponent', () => {
  let component: AddAlertContentComponent;
  let fixture: ComponentFixture<AddAlertContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAlertContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAlertContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
