import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartsModule } from 'ng2-charts';
import { DataTableService } from '../../Service/data-table.service';
//import { updateBinding } from '@angular/core/src/render3/instructions';
import { Observable } from 'rxjs';
import {view1 } from 'src/model/view1.model';


@Component({
  selector: 'app-view1-data-chart',
  templateUrl: './view1-data-chart.component.html',
  styleUrls: ['./view1-data-chart.component.css']
})
export class View1DataChartComponent implements OnInit {

  private updatedData: view1[]=[];
  public barChartOptions: ChartOptions = {
    responsive: true,

    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  // public barChartData: ChartDataSets[];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(private dataTable: DataTableService) {

   }

  ngOnInit() {
    this.update();
  }
  update()
  {
    // this.data=this.dataTable.getData();
    // console.log(this.data);
    // barChartLabels:this.data._id;
    // barChartData : [
    //   { data: this.data.percOfAssessedVal, label: 'Series A' },
    //   { data: this.data.percOfLand, label: 'Series B' }
    // ];
    // console.log("data:id ",this.data._id);
    // console.log("data:id ",this.data.percOfLand);
    //const dataObservable =
    this.dataTable.getData()
    .subscribe((data: view1[])=>{
        this.updatedData=data;
            //console.log("data: ",this.updatedData);

    });
    // barChartLabels:this.updatedData._id;
    // barChartData : [
    //   { data: data.percOfAssessedVal, label: 'Series A' },
    //   { data: data.percOfLand, label: 'Series B' }
    // ];

  }
  ngAfterViewChecked(){
    this.update();

  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
