import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContractComponent } from './manage-contract.component';

describe('ManageContractComponent', () => {
  let component: ManageContractComponent;
  let fixture: ComponentFixture<ManageContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
