import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';
import inside from 'point-in-polygon';

//Models
import { JsonForm } from '../../model/jsonform.model';

import * as L from 'leaflet';
import 'leaflet-selectareafeature/dist/Leaflet.SelectAreaFeature.js';
import * as L1 from 'leaflet.glify';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  features: any;
  shapeLayer : any;
  map: any;
  geoJsonLayer;
  layerGroup: any;
  html_city: String;
  html_neighborhood: String;
  latlng_area:any;
  selectfeature:any;
  EPSILON = 0.00001;
  recentData:any;
  lassoData = [];
  constructor(
    private centralService : CentralService
  ) { }

  ngOnInit() {
    //Initialize Map with no labels
    this.map = L.map('map').setView([41.4843,-81.9332], 10);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    	subdomains: 'abcd',
    	maxZoom: 19,
      zIndex: 1}).addTo(this.map);
    //add only Labels to the map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    	subdomains: 'abcd',
    	maxZoom: 19,
      zIndex: 3}).addTo(this.map);
    //Initialize geoJsonLayer
    this.geoJsonLayer = L.geoJSON();
  }

  updateAllData(){
    this.centralService.getChartData(); // inital subscribe of the data
    this.centralService.getGeometry().subscribe(
        data  => {
          this.recentData = data;
          //deletes the layer if already initialized
          if(this.shapeLayer !== undefined){
            this.shapeLayer.remove();
          }
          console.log(this.shapeLayer);
          // //removes layer from map
          // this.geoJsonLayer.removeFrom(this.map);
          // //re-initializes layer
          this.geoJsonLayer = L.geoJSON();
          // //console.log("SIZE = " + JSON.stringify(data).length);
          this.geoJsonLayer.addData(data);
          //gets the maximum view size for map
          var latLngBounds = this.geoJsonLayer.getBounds();
          this.map.flyToBounds(latLngBounds,{duration:0.6,easeLinearity:1.0});
          // alert(JSON.stringify(data));
          this.shapeLayer = L1.shapes({
            data: data,
            map: this.map,
            opacity: 0.7,
            click:(e, feature : JsonForm) => {
              //do something when a shape is clicked
              L.popup().setLatLng(e.latlng)
                .setContent("ParcelPin: " + feature.properties.parcelpin +
                " SiteCat1: " + feature.properties.SiteCat1
              ).openOn(this.map);
            },
            color: (index : Number, feature : JsonForm) => {
              //this will take a feature and map its sitecat zone to a color
              var zoneType : String = feature.properties.SiteCat1;
              switch(zoneType){
                case "Residential":
                  return L1.color.fromHex("E5BE77");
                case "Commercial":
                  return L1.color.fromHex("FF4C4C");
                case "Industrial":
                  return L1.color.fromHex("BE69F2");
                case "Mixed":
                  return L1.color.fromHex("fd8f45");
                case "Government":
                  return L1.color.fromHex("7A7ACB");
                case "Institutional":
                  return L1.color.fromHex("3D3DCB");
                case "Utility":
                  return L1.color.fromHex("BEBEBE");
                default:
                  return L1.color.fromHex("505050");
              }
            }
          });
        }
      );

  }
  //add check initialized/undefined flags
  getLassoPlots(){
    //sets latlng_area to an array of Points objs, need them as touples
    this.latlng_area = this.selectfeature.getAreaLatLng();
    this.lassoData = [];
    let tempArray = [];
    for(let q = 0; q < this.latlng_area.length; q++){
      let temp = [this.latlng_area[q].lng,this.latlng_area[q].lat]
      tempArray.push(temp);
    }
    console.log(tempArray);
    // console.log(JSON.stringify(this.recentData));
    for(let i = 0; i < this.recentData.features.length;i++){
      for(let j = 0; j < this.recentData.features[i].geometry.coordinates[0].length;j++){
        if(inside(this.recentData.features[i].geometry.coordinates[0][j],tempArray) % 2 == 1){
          //odd
          //console.log("I:" + i + " Pushed");
          this.lassoData.push(this.recentData.features[i]);
          break;
        }
      }
    }
    console.log("Length:" + this.lassoData.length);
    console.log(JSON.stringify(this.lassoData));
    let tempView1Data = [];
    // for(int k = 0; k < this.lassoData.length;k++){
    //   // tempView1Data.push(e -> {"_id":{
    //   //   this.lassoData[k].properties.SiteCat1},
    //   //   "Scale":this.lassoData[k.],"AssessedValue":,"No_parcels":,"percOfLand":,"percOfAssessedVal":null
    //   // });
    // }
    //this.centralService.changeView1(tempView1Data);
  }
  //Works using https://stackoverflow.com/questions/328107/how-can-you-determine-a-point-is-between-two-other-points-on-a-line-segment
  //Find slope formular y = mx + b, get point on line segement AB
  //Check new point D is between A and B on line-segment AB
  findIntercept(A,B,C){
    // console.log("A lng :" + A.lng + " Lat:" + A.lat);
    // console.log("B lng :" + B.lng + " Lat:" + B.lat);
    // console.log("C lng :" + C.lng + " Lat:" + C.lat);
    let slope = (B.lat - A.lat)/(B.lng - A.lng);
    let xIntercept = A.lat - (slope*A.lng);
    //console.log("y=" + slope + "x + " + xIntercept);
    let D = {
      lat:(slope*C.lng + xIntercept),
      lng:C.lng
    };
    let crossproduct = (D.lat - A.lat) * (B.lng - A.lng) - (D.lng - A.lng) * (B.lat - A.lat);
    //console.log("Crossproduct:" + crossproduct);
    if(Math.abs(crossproduct) > this.EPSILON){
      return false;
    }
    let dotproduct = (C.lng - A.lng) * (B.lng - A.lng) + (C.lat - A.lat)*(B.lat - A.lat);
    if (dotproduct < 0){
        return false
    }
    let squaredlengthba = (B.lng - A.lng)*(B.lng - A.lng) + (B.lat - A.lat)*(B.lat - A.lat);
    if (dotproduct > squaredlengthba){
        return false
    }
    return true
  }
}
