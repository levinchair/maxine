import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CentralService } from '../Service/central.service';
import { Chart } from 'chart.js';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablesComponent } from '../tables/tables.component';
import { CurrencyPipe } from '@angular/common';

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
  @ViewChild('chartA') private chartRef;
  chart: any;
  view1Data: any;
  view2Data: any;
  view3Data: any;
  landUseConcentrationData = [];
  chartType: string;
  title = "Title";
  yAxisLabel = "Acre %"
  labels = [];
  colorsLU = [];
  colorsCR4 = [];
  landUseData = [];
  CR4 = [];
  model = "value";
  //CREATE A MAP OF CAT->HEX COLORS
  CATCOLORS = new Map([["Residential","#E5BE77"],["Commercial","#FF4C4C"],
                      ["Industrial","#BE69F2"],["Mixed","#fd8f45"],
                      ["Government","#7A7ACB"],["Institutional","#3D3DCB"],
                      ["Utility","#F1F1F1"],[null,"#BEBEBE"]]);

  PARCELCATEGORIES = [["AssessedValue","Assessed Value"],
                      ["No_parcels","Number of Parcels"],
                      ["percOfLand","Percentage of Land"],
                      ["percOfAssessedVal","Percentage of Assessed Value"]];

  constructor(private centralService: CentralService,
              private cp: CurrencyPipe,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.createChart();
    this.centralService.view1Data
      .subscribe( view => {
        console.log("View1:" + JSON.stringify(view));
        this.view1Data = view;
        this.updateChart1();
      });
    this.centralService.view2Data
      .subscribe( view => {
        this.view2Data = view;
      });
    this.centralService.view3Data
      .subscribe( view => {
        this.view3Data = view;
      });
    this.centralService.landUseConcentrationData
      .subscribe( view => {
        console.log("LUConc:" + JSON.stringify(view));
        this.landUseConcentrationData = view;
        this.updateChart1();
      });
  }

  createChart(){
    //Land Use
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels, // your labels array
        datasets: [
          {
            label:"CR4",
            data: this.CR4,
            type:'scatter',
            backgroundColor: "#FFFFFF00",
            borderWidth:1,
            pointBackgroundColor:"black",
            borderColor:"black",
            showLine:false,
            yAxisID: 'cr4-y-axis'
          },{
            label:"Land Use",
            data: this.landUseData, // your data array
            type: 'bar',
            backgroundColor: this.colorsLU,
            borderColor: '#FFFFFF',
            borderWidth: 0,
            hoverBackgroundColor: this.colorsLU,
            hoverBorderWidth:2,
            yAxisID: 'lu-y-axis'
          }]
      },
      options: {
        title: {
          display: true,
          text: this.title,
          fontSize: 24,
          fontColor: '#000'
        },
        legend:{
          display:true,
          position:"bottom"
        },
        scales: {
            yAxes: [{
                    id:"cr4-y-axis",
                    type:'linear',
                    position:'right',
                    scaleLabel: {
                        display: true,
                        labelString: "CR4 %"
                    }},
                    {
                      id:"lu-y-axis",
                      type:"linear",
                      scaleLabel: {
                          display: true,
                          labelString: "Total Value $"
                      },
                      ticks:{
                        callback: function(value, index, values) {
                             //cannot call outside methods wtf charts.js
                             var retVal = "";
                             while(value/1000 >= 1){
                               console.log("val=" + value);
                               retVal = ",000" + retVal;
                               value = value/1000;
                             }
                             if(value >= 1){retVal = "$" + value*10 + retVal;}
                             else if(value > 0){retVal = "$" + value + "," + retVal;}
                             return retVal;
                         }
                      }
                    }]
        },
        responsive:true,
        maintainAspectRatio:false,
        devicePixelRatio: 1
      },

    });
  }

  updateChart1(){
    this.labels.length = 0;
    this.colorsLU.length = 0;
    this.colorsCR4.length = 0;
    this.chart.options.title.text = this.centralService.getCity() + ' : ' + this.centralService.getHood();
    //Pushing Colors for matching
    for(var x = 0; x < this.view1Data.length; x++){
      this.labels.push(this.view1Data[x].cat);
      if(this.CATCOLORS.has(this.labels[x])){
        this.colorsLU.push(this.CATCOLORS.get(this.labels[x]));
      }else{
        this.colorsLU.push("#5050505");
      }
    }
    this.chart.update(); //Charts can never have an empty data variable
    this.landUseData.length = 0;
    this.CR4.length = 0;
    for(var y = 0; y < this.view1Data.length; y++){
      this.landUseData.push(this.view1Data[y].AssessedValue.toFixed(0));
    }
    for(var z = 0; z < this.landUseConcentrationData.length; z++){
      this.CR4.push(this.landUseConcentrationData[z].MarketCR4.toFixed(1));
    }
    this.chart.update();
  }

  openTable(){
    const modalRef = this.modalService.open(TablesComponent,{ centered: true, size: 'lg'});
  }
  yLandUseAcre(data){

  }

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
