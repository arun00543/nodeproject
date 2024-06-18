import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeadGenerationComponent } from './manage-lead-generation.component';

describe('ManageLeadGenerationComponent', () => {
  let component: ManageLeadGenerationComponent;
  let fixture: ComponentFixture<ManageLeadGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLeadGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLeadGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
