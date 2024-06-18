import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedMapComponent } from './embedded-map.component';

describe('EmbeddedMapComponent', () => {
  let component: EmbeddedMapComponent;
  let fixture: ComponentFixture<EmbeddedMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedMapComponent]
    });
    fixture = TestBed.createComponent(EmbeddedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
