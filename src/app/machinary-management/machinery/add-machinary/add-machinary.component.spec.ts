import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachinaryComponent } from './add-machinary.component';

describe('AddMachinaryComponent', () => {
  let component: AddMachinaryComponent;
  let fixture: ComponentFixture<AddMachinaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMachinaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMachinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
