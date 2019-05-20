import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { View3DataChartComponent } from './view3-data-chart.component';

describe('View3DataChartComponent', () => {
  let component: View3DataChartComponent;
  let fixture: ComponentFixture<View3DataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ View3DataChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(View3DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
