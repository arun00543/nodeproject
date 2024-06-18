import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductionComponent } from './manage-production.component';

describe('ManageProductionComponent', () => {
  let component: ManageProductionComponent;
  let fixture: ComponentFixture<ManageProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
