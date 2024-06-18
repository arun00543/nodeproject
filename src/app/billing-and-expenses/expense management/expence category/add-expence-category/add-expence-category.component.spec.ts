import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenceCategoryComponent } from './add-expence-category.component';

describe('AddExpenceCategoryComponent', () => {
  let component: AddExpenceCategoryComponent;
  let fixture: ComponentFixture<AddExpenceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpenceCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
