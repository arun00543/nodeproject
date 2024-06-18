import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionComponent } from './add-production.component';

describe('AddProductionComponent', () => {
  let component: AddProductionComponent;
  let fixture: ComponentFixture<AddProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
