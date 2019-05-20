import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { View2DataChartComponent } from './view2-data-chart.component';

describe('View2DataChartComponent', () => {
  let component: View2DataChartComponent;
  let fixture: ComponentFixture<View2DataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ View2DataChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(View2DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
