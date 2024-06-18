import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductionStockComponent } from './manage-production-stock.component';

describe('ManageProductionStockComponent', () => {
  let component: ManageProductionStockComponent;
  let fixture: ComponentFixture<ManageProductionStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProductionStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductionStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
