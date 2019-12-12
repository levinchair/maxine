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
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  @Input() defaultChoice: string;
  @Input() value: string;
  @ViewChild('chartA') private chartRef;
  chart: any;
  view1Data: any;
  view2Data: any;
  view3Data: any;
  view4Data: any;
  landUseConcentrationData = [];
  chartType: string;
  title = "Title";
  yAxisLabel = "Acre %"
  labels = [];
  colorsLU:any = [];
  colorsCR4 = [];
  chartData = [];
  CR4 = [];
  model = "value";
  updateChartPending = false;
  currentView = "Land Use";
  //CREATE A MAP OF CAT->HEX COLORS
  CATCOLORS = new Map([["Residential","#E5BE77"],["Commercial","#FF4C4C"],
                      ["Industrial","#BE69F2"],["Mixed","#fd8f45"],
                      ["Government","#7A7ACB"],["Institutional","#3D3DCB"],
                      ["Utility","#F1F1F1"],[null,"#BEBEBE"]]);

  PARCELCATEGORIES = [["AssessedValue","Assessed Value"],
                      ["No_parcels","Number of Parcels"],
                      ["percOfLand","Percentage of Land"],
                      ["percOfAssessedVal","Percentage of Assessed Value"]];
  DEFAULTCOLORS    = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99",
                      "#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a",
                      "#ffff99","#b15928"];
  constructor(public centralService: CentralService,
              public cp: CurrencyPipe,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.createChart();
    this.centralService.view1Data
      .subscribe( view => {
        // console.log("View1:" + JSON.stringify(view));
        this.view1Data = view;
      });
    this.centralService.view2Data
      .subscribe( view => {
        this.view2Data = view;
        // console.log(view);
        this.updateCharts(this.model,'Residential');
      });
    this.centralService.view3Data
      .subscribe( view => {
        this.view3Data = view;
        // console.log(view);
        this.updateCharts(this.model,'Commercial');

      });
      this.centralService.view4Data
        .subscribe( view => {
          this.view4Data = view;
          // console.log(view);
          this.updateCharts(this.model,'Industrial');

        });
    this.centralService.landUseConcentrationData
      .subscribe( view => {
        // console.log("LUCdata:" + JSON.stringify(view));
        this.landUseConcentrationData = view;
        this.updateChartPending = true;
        this.updateCharts(this.model,'All');
      });
  }
  updateCharts(yAxisType, sender){
    var sitecat1 = this.centralService.get_landUse();
    if(sitecat1 == 'Commercial' || sitecat1 == 'Residential' || sitecat1 == 'Industrial'){
      if(sitecat1 == sender){
        this.updateChart2(yAxisType,sender);
      }
    }else if(sitecat1 == 'Institutional' || sitecat1 == 'Govermment' ||
      sitecat1 == "Mixed" || sitecat1 == "Utility" || sitecat1 == "All" || sitecat1 == null){
        if(this.updateChartPending){
          this.updateChart1(yAxisType);
          this.updateChartPending = false;
        }
      }
  }
//http://jsfiddle.net/1Lngmtz7/
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
            label:this.currentView,
            data: this.chartData,
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
          position:"bottom",
          labels:{
            usePointStyle:true
          }
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
                        callback:(value,index,values) =>{
                          return this.cp.transform(value,"USD","symbol","1.0-0");
                        }
                      }
                    }]
        },
        tooltips:{
          callbacks: {
            label:(tooltipItem,data) => {
              var label = " ";
              if(tooltipItem.datasetIndex == 0){
                return label + tooltipItem.yLabel + "%";
              }else{
                return label + this.yAxisCheck(tooltipItem.index);
              }
            }
          }
        },
        hover:{
          mode:'nearest'
        },
        responsive:true,
        maintainAspectRatio:false,
        devicePixelRatio: 1
      },
    });
  }

  updateChart1(selection){
    if(this.view1Data){
      this.labels.length = 0;
      this.colorsLU.length = 0;
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
      // this.chart.update(); //Charts can never have an empty data variable
      this.chartData.length = 0;this.chartData.length = this.view1Data.length;
      this.CR4.length = 0; this.CR4.length = this.landUseConcentrationData.length;
      //Check for selection value/acres
      if(selection == 'value'){
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Value $";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","symbol","1.0-0");
        };
        for(var y = 0; y < this.view1Data.length; y++){
          var index = this.labels.indexOf(this.view1Data[y].cat);
          this.chartData[index] = this.view1Data[y].AssessedValue.toFixed(0);
        }
        for(var z = 0; z < this.landUseConcentrationData.length; z++){
          var cr4Index = this.labels.indexOf(this.landUseConcentrationData[z].landuse);
          this.CR4[cr4Index] = (this.landUseConcentrationData[z].MarketCR4 * 100).toFixed(0);
        }
      }else{
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Acres";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","","1.0-0");
        };
        for(var z = 0; z < this.landUseConcentrationData.length; z++){
          var cr4Index = this.labels.indexOf(this.landUseConcentrationData[z].landuse);
          this.chartData[cr4Index] = this.landUseConcentrationData[z].landuseTot.toFixed(0);
        }
      }
      this.chart.update();
    }
  }
  updateChart2(selection,sitecat1){
    this.labels.length = 0;
    if(this.centralService.getHood() == "All"){
      this.chart.options.title.text = this.centralService.getCity() + ":" + sitecat1;
    }else{
      this.chart.options.title.text = this.centralService.getHood() + ":" + sitecat1;
    }
    this.colorsLU.length = 0;
    this.chartData.length = 0;this.chartData.length = this.view1Data.length;
    this.CR4.length = 0;this.CR4.length = this.landUseConcentrationData.length;
    //Residential subcats
    if(sitecat1 == "Residential" && this.view2Data !== undefined){
      for(var subcat in this.view2Data){
        this.labels.push(this.view2Data[subcat].cat);
        this.colorsLU.push(this.DEFAULTCOLORS[subcat])
      }
      if(selection == "value"){ //y-axis should display value
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Value $";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","symbol","1.0-0");
        };
        for(var y in this.view2Data){
          var indexA = this.labels.indexOf(this.view2Data[y].cat);
          this.chartData[indexA] = this.view2Data[y].AssessedValue.toFixed(0);
          this.CR4[indexA] = (this.view2Data[y].CR4 * 100).toFixed(0);
        }
      }else{ //y-axis should display acres

      }
    }else if(sitecat1 == "Commercial" && this.view3Data !== undefined){
      for(var subcat in this.view3Data){
        this.labels.push(this.view3Data[subcat].cat);
        this.colorsLU.push(this.DEFAULTCOLORS[subcat])
      }
      if(selection == "value"){ //y-axis should display value
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Value $";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","symbol","1.0-0");
        };
        for(var x in this.view3Data){
          var indexB = this.labels.indexOf(this.view3Data[x].cat);
          this.chartData[indexB] = this.view3Data[x].AssessedValue.toFixed(0);
          this.CR4[indexB] = (this.view3Data[x].CR4 * 100).toFixed(0);
        }
      }else{ //y-axis should display acres
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Acres";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","","1.0-0");
        };
        for(var y2 in this.view3Data){
          var index2 = this.labels.indexOf(this.view3Data[y2].cat);
          this.chartData[index2] = ((this.view3Data[y2].sq_feet)/43560).toFixed(0);
          // this.CR4[index2] = (this.view3Data[y2].CR4 * 100).toFixed(0);
        }
      }
    }else if(sitecat1 == "Industrial" && this.view4Data !== undefined){
      for(var subcat in this.view4Data){
        this.labels.push(this.view4Data[subcat].cat);
        this.colorsLU.push(this.DEFAULTCOLORS[subcat])
      }
      if(selection == "value"){ //y-axis should display value
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Value $";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","symbol","1.0-0");
        };
        for(var y in this.view4Data){
          var indexC = this.labels.indexOf(this.view4Data[y].cat);
          this.chartData[indexC] = this.view4Data[y].AssessedValue.toFixed(0);
          // this.CR4[indexC] = (this.view4Data[y].CR4 * 100).toFixed(0);
        }
      }else{ //y-axis should display acres
        this.chart.options.scales.yAxes[1].scaleLabel.labelString = "Total Acres";
        this.chart.options.scales.yAxes[1].ticks.callback = (value,index,values) =>{
          return this.cp.transform(value,"USD","","1.0-0");
        };
        for(var y2 in this.view4Data){
          var index2 = this.labels.indexOf(this.view4Data[y2].cat);
          this.chartData[index2] = ((this.view4Data[y2].sq_feet)/43560).toFixed(0);
        }
      }
    }else{console.log("Error charts.comp.ts: something seriously broke")}
    this.chart.update();
  }
  yAxisCheck(data){
    if(this.model == 'value'){
      return this.cp.transform(this.chartData[data],"USD","symbol","1.0-0");
    }else{
      return this.cp.transform(this.chartData[data],"USD","","1.0-0");
    }
  }
  openTable(){
    const modalRef = this.modalService.open(TablesComponent,{ centered: true, size: 'lg'});
  }
}
