import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CentralService } from '../Service/central.service';
import { Chart } from 'chart.js';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';

//models
import { view1 } from '../../model/view1.model';

export interface Attributes {
  value: string;
  attrValue: string;
}
export interface Views {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() defaultChoice: string;
  @Input() value: string;
  @Output() change: EventEmitter<MatRadioChange>;
  @ViewChild('chartA') private chartRef;
  chart: any;
  view1Data: any;
  chartType: string;
  title = "Total Value";
  labels = [];
  colors = [];
  chartData = [];
  //CREATE A MAP OF CAT->HEX COLORS
  CATCOLORS = new Map([["Residential","#E5BE77"],["Commercial","#FF4C4C"],
                      ["Industrial","#BE69F2"],["Mixed","#fd8f45"],
                      ["Government","#7A7ACB"],["Institutional","#3D3DCB"],
                      ["Utility","#BEBEBE"],[null,"#F1F1F1"]]);

  PARCELCATEGORIES = [["AssessedValue","Assessed Value"],
                      ["No_parcels","Number of Parcels"],
                      ["percOfLand","Percentage of Land"],
                      ["percOfAssessedVal","Percentage of Assessed Value"]];
  constructor(private centralService: CentralService) { }

  ngOnInit() {
    // this.createChart();
    this.createChart();
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        this.updateChart1(this.centralService.currentAttr);
      });
  }

  createChart(){
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels, // your labels array
        datasets: [
          {
            label:"",
            data: this.chartData, // your data array
            backgroundColor: this.colors,
            borderColor: '#FFFFFF',
            borderWidth: 0,
            hoverBackgroundColor: this.colors,
            hoverBorderWidth:5,
            hoverBorderColor: '#FFFFFF'
          }
        ]
      },
      options: {
        title: {
          display: false,
          text: this.title,
          fontSize: 16
        },
        legend:{
          display:false
        },
        scales: {
            yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            if(label >= 1000000){
                              return label/1000000+'m';
                            }else if(label >= 1000){
                              return label/1000+'k';
                            }else{
                              return label;
                            }
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '1k = 1,000 | 1m = 1,000,000'
                    }}]
        },
        responsive:true,
        maintainAspectRatio:false
      }
    });
  }

  updateChart1(parcelCategory:string){
    this.labels.length = 0;
    this.colors.length = 0;
    //IDK why array.map doesn't work so I have to use a for loop
    for(var x = 0; x < this.view1Data.length; x++){
      this.labels.push(this.view1Data[x].cat);
      if(this.CATCOLORS.has(this.labels[x])){
        this.colors.push(this.CATCOLORS.get(this.labels[x]));
      }else{
        this.colors.push("#5050505");
      }
    }
    this.chart.update(); //Charts can never have an empty data variable
    this.chartData.length = 0;
    var fixed = (parcelCategory == ("percOfLand" || "percOfAssessedVal")) ? 2 : 0;
    for(var y = 0; y < this.view1Data.length; y++){
      this.chartData.push(this.view1Data[y][parcelCategory].toFixed(fixed));
    }
    this.chart.update();
  }

  chart1Change(e){
    //console.log(e + this.view1Data[0][e]);
    this.updateChart1(e);
  }

  attributes: Attributes[] = [
    {value:'AssessedValue',attrValue:'Total Value'},
    {value:'No_parcels',attrValue:'# Parcels'},
    {value:'percOfLand',attrValue:'% Land'},
    {value:'percOfAssessedVal',attrValue:'% Value'}
  ];
  views: Views[] = [
    {value:'view1',viewValue:'View 1'}
    // {value:'view2',viewValue:'View 2'},
    // {value:'view3',viewValue:'View 3'},
    // {value:'view4',viewValue:'View 4'},
    // {value:'concentration',viewValue:'Owner Concentration'},
    // {value:'landUseConcentrationData',viewValue:'Land Use Concentration'}
  ];
  // View1: [
  //   {"_id":{"cat":"Mixed"},
  //    "Scale":170037,"AssessedValue":1002200,"No_parcels":31,"percOfLand":3.170551611874675,
  //    "percOfAssessedVal":0.3737736368376259},
  //    {"_id":{"cat":null},
  //    "Scale":16861,"AssessedValue":2900,"No_parcels":115,"percOfLand":0.3143943419833265,
  //    "percOfAssessedVal":0.0010815641057963631},
  //    {"_id":{"cat":"Utility"},"Scale":4690,"AssessedValue":108600,"No_parcels":2,"percOfLand":0.08745089045144425,
  //    "percOfAssessedVal":0.04050271099637415},
  //    {"_id":{"cat":"Industrial"},"Scale":237474,"AssessedValue":2925000,"No_parcels":30,
  //    "percOfLand":4.427998456090889,"percOfAssessedVal":1.0908879342946076},
  //    {"_id":{"cat":"Institutional"},"Scale":782749,"AssessedValue":41988900,"No_parcels":379,"percOfLand":14.595329861402458,"percOfAssessedVal":15.659892097197556},
  //    {"_id":{"cat":"Government"},"Scale":1542624,"AssessedValue":84820100,"No_parcels":1675,"percOfLand":28.76414550783981,"percOfAssessedVal":31.633922624157968},{"_id":{"cat":"Commercial"},"Scale":719408,"AssessedValue":15546700,"No_parcels":249,"percOfLand":13.414258037930193,"percOfAssessedVal":5.798190580546317},{"_id":{"cat":"Residential"},"Scale":1889167,"AssessedValue":121735800,"No_parcels":3118,"percOfLand":35.2258712924272,"percOfAssessedVal":45.40174885186376}]
}
