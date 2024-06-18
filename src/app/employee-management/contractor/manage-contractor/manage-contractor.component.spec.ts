import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractorComponent } from './manage-contractor.component';

describe('ManageContractorComponent', () => {
  let component: ManageContractorComponent;
  let fixture: ComponentFixture<ManageContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContractorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
