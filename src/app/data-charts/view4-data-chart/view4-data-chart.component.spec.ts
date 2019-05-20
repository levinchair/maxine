import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { View4DataChartComponent } from './view4-data-chart.component';

describe('View4DataChartComponent', () => {
  let component: View4DataChartComponent;
  let fixture: ComponentFixture<View4DataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ View4DataChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(View4DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
