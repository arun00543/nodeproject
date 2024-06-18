import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmChartComponent } from './crm-chart.component';

describe('CrmChartComponent', () => {
  let component: CrmChartComponent;
  let fixture: ComponentFixture<CrmChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
