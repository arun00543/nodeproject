import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AddServiceBreakdownComponent } from './add-service-breakdown.component';

describe('AddServiceBreakdownComponent', () => {
  let component: AddServiceBreakdownComponent;
  let fixture: ComponentFixture<AddServiceBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceBreakdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
