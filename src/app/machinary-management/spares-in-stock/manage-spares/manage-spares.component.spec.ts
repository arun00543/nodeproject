import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSparesComponent } from './manage-spares.component';

describe('ManageSparesComponent', () => {
  let component: ManageSparesComponent;
  let fixture: ComponentFixture<ManageSparesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSparesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSparesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
