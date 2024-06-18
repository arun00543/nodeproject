import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadGenerationComponent } from './add-lead-generation.component';

describe('AddLeadGenerationComponent', () => {
  let component: AddLeadGenerationComponent;
  let fixture: ComponentFixture<AddLeadGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeadGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLeadGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
