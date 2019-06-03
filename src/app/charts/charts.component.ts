import { Component, OnInit, ViewChild } from '@angular/core';
import { CentralService } from '../Service/central.service';
import { Chart } from 'chart.js';
//models
import { view1 } from '../../model/view1.model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChild('chartA') private chartRef;
  chart: any;
  view1Data: any;
  constructor(private centralService: CentralService) { }

  ngOnInit() {
    this.createChart();
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        this.updateChart1();
      });
  }

  createChart(){
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ["Red","Yellow","Blue"], // your labels array
        datasets: [
          {
            data:[10,20,30], // your data array
            backgroundColor:[
                              "#f62222",
                              "#fff68f",
                              "#2b9ae0"],
            borderColor: '#000000',
            borderWidth: 0,
            hoverBackgroundColor: "#b5d8f6"
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        responsive: false,
      }
    });
  }

  updateChart1(){
    this.chart.data.labels.push(["Red","Yellow","Blue"]);
    this.chart.datasets[0].data.push([10,20,30]);
    this.chart.update();
  }
}
