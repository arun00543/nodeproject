import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSparesComponent } from './add-spares.component';

describe('AddSparesComponent', () => {
  let component: AddSparesComponent;
  let fixture: ComponentFixture<AddSparesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSparesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSparesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
