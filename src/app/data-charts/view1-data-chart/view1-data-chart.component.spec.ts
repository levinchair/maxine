import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { View1DataChartComponent } from './view1-data-chart.component';

describe('View1DataChartComponent', () => {
  let component: View1DataChartComponent;
  let fixture: ComponentFixture<View1DataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ View1DataChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(View1DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
