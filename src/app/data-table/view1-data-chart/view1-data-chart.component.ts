import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DataTableService } from '../../Service/data-table.service'

@Component({
  selector: 'app-view1-data-chart',
  templateUrl: './view1-data-chart.component.html',
  styleUrls: ['./view1-data-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class View1DataChartComponent implements OnInit {

  constructor(private dataService: DataTableService){};
  ngOnInit() {
    
    this.dataService.getView1Chart();
    console.log('msg from chart')
  }
  
}
