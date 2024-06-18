import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExpenceCategoryComponent } from './manage-expence-category.component';

describe('ManageExpenceCategoryComponent', () => {
  let component: ManageExpenceCategoryComponent;
  let fixture: ComponentFixture<ManageExpenceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageExpenceCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageExpenceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
