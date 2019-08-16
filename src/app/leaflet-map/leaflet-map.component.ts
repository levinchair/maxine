import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';
import inside from 'point-in-polygon';

//Models
import { JsonForm } from '../../model/jsonform.model';

import * as L from 'leaflet';
import 'leaflet-selectareafeature/dist/Leaflet.SelectAreaFeature.js'; // strictly import dist
import * as L1 from 'leaflet.glify';

//spinner component

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
  lassoData : any[];
  sat: boolean;
  googleSat: any;
  maplabels:any;
  streets: any;
  lassoToggle:boolean = false;


  constructor(
    private centralService : CentralService,
  ) { }

  ngOnInit() {
    //Initialize Map with no labels
    this.map = L.map('map').setView([41.4843,-81.9332], 10);
    
    //for parcelpin data. Will be fired everytime there is an update to the data
    this.sub();

    //init layers
    this.googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    this.streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      zIndex: 1}).addTo(this.map);
    //only labels
    this.maplabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    	subdomains: 'abcd',
    	maxZoom: 19,
      zIndex: 3}).addTo(this.map);
    //Initialize geoJsonLayer
    this.geoJsonLayer = L.geoJSON();

    //set layer to the map
    this.sat = true;
    this.setBaseLayer();

  }
  sub(){
     this.centralService.geometryData.subscribe( 
      view => {
        this.recentData = view;
        this.geoJsonLayer = L.geoJSON();
        this.geoJsonLayer.addData(view);
        var latLngBounds = this.geoJsonLayer.getBounds();
        this.map.flyToBounds(latLngBounds,{duration:0.6,easeLinearity:1.0});
        this.setShapeLayer(view);
      });
  }

  //add check initialized/undefined flags
  getLassoPlots(){
    //sets latlng_area to an array of Points objs, need them as touples
    if(this.selectfeature === undefined) {
      alert("Please use lasso to select an area");
      this.latlng_area = []
    }else {
      this.latlng_area = this.selectfeature.getAreaLatLng();
    }
    this.lassoData = [];
    let tempArray = [];
    for(let q = 0; q < this.latlng_area.length; q++){
      let temp = [this.latlng_area[q].lng,this.latlng_area[q].lat]
      tempArray.push(temp);
    }
    console.log("temparray: " + JSON.stringify(tempArray));
    if(tempArray === null || tempArray.length == 0) {
      throw new Error("temp array is empty");
    }
    let feature = [];
    let allPoints = 0;
    // console.log(JSON.stringify(this.recentData));
    for(let i = 0; i < this.recentData.features.length;i++){ // for each feature in features
      feature = this.recentData.features[i].geometry.coordinates;
      for(let j = 0; j < feature.length;j++){ //for each polygon in feature
        for(let k = 0; k < feature[j].length; k++  ){ //for each hole in polygon
          allPoints = 0;
          for(let l = 0; l < feature[j][k].length; l++){ // for each point in polygon
            //console.log(JSON.stringify(feature[0][j][l]));
            if(inside(feature[j][k][l],tempArray) % 2 == 1){
              allPoints+=1;
              if(!this.lassoData.includes(this.recentData.features[i]) && allPoints == feature[j][k].length){
               this.lassoData.push(this.recentData.features[i]);
             }
            }
          }
        }
      }
    }
    // console.log("Length:" + this.lassoData.length);
    //console.log(JSON.stringify(this.lassoData.length));
    
    if (!this.lassoData || this.lassoData.length == 0) {
      throw new Error("No points were selected");
    } else {
      this.centralService.showSpinner.next(true)
      this.centralService.setParcelArray(this.lassoData);
      this.centralService.getbyParcelpins(); // this will initiate a http request which will update subscription
    }

  }
  setShapeLayer(parcels){

    if(this.shapeLayer !== undefined) this.shapeLayer.remove();

    this.shapeLayer = L1.shapes({
      data: parcels,
      map: this.map,
      opacity: 0.7,
      click:(e, feature : JsonForm) => {
        let popupContent = "<p>" +
          "<b>Parcel Pin</b> : " + feature.properties.parcelpin + "<br>" +
          "<b>Land Use</b>   : " + feature.properties.SiteCat1 + "<br>" +
          "<b>-> Sub-Category</b> : " + feature.properties.SiteCat2 + "<br>" +
          "<b>Address</b>    : " + feature.properties.par_addr_a + "<br>" +
          "<b>Total SqFt</b> : " + feature.properties.total_squa + "<br>" +
          "<b>Owner</b>      : " + feature.properties.deeded_own2 + "</p>";
        //do something when a shape is clicked
        L.popup().setLatLng(e.latlng)
          .setContent(popupContent).openOn(this.map);
      },
      border: true,
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
  setBaseLayer(){
    /* Toggles between satellite view and street view */
    if(this.sat){
      this.sat = false;
      this.streets.addTo(this.map);
      this.googleSat.removeFrom(this.map);
    }else{
      this.sat = true;
      this.googleSat.addTo(this.map);
      this.streets.removeFrom(this.map);
    }
  }

  removeLassoPolygons(){
    if(this.selectfeature !== undefined) this.selectfeature.removeAllArea();
    this.centralService.setParcelArray([]);
    //reset views after being deleted
    this.centralService.showSpinner.next(true);
    this.centralService.getGeometry();
    this.centralService.getViews();
  }

  toggleLasso(){
    if(this.lassoToggle){
      this.map.selectAreaFeature.disable();
      this.lassoToggle = false;
    }else{
      this.selectfeature = this.map.selectAreaFeature.enable();
      this.lassoToggle = true;
    }
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
