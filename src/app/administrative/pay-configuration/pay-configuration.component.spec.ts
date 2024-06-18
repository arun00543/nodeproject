import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayConfigurationComponent } from './pay-configuration.component';

describe('PayConfigurationComponent', () => {
  let component: PayConfigurationComponent;
  let fixture: ComponentFixture<PayConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
