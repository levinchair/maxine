import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';
import inside from 'point-in-polygon';
//Models
import { JsonForm } from '../../model/jsonform.model';
import * as L from 'leaflet';
import 'leaflet-selectareafeature/dist/Leaflet.SelectAreaFeature.js'; // strictly import dist
import * as L1 from 'leaflet.glify';
import { CurrencyPipe } from '@angular/common';
import { BehaviorSubject } from "rxjs/Rx";
// import { NeighborhoodBoundaries } from '../../assets/JSON/cleveland_spa';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})

export class LeafletMapComponent implements OnInit {
  map: any;
  shapeLayer : any;
  geoJsonLayer;
  selectfeature:any;
  recentData:any;
  cityHoodLassoData:any = [];
  cities:string[];
  neighborhoods:string[];
  sat: boolean;
  googleSat: any;
  maplabels:any;
  streets: any;
  lassoToggle:boolean = false;
  selectionToggle: boolean = false;
  selectedParcels: String[] = []; // holds all the parcels selected by tools
  feature : JsonForm;
  landuse: String[];
  marker:any;
  currentSiteCat:String;
  lassoPoints:any;
  enhancedLasso: boolean = false;
  constructor(
    public centralService : CentralService,
    public cp: CurrencyPipe
  ){}

  ngOnInit() {
    this.landuse = this.centralService.getLanduse();
    //Initialize Map with no labels
    this.map = L.map('map').setView([41.4843,-81.9332], 10);
    this.sub();//for parcelpin data. Will be fired everytime there is an update to the data
    this.googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    //https://github.com/CartoDB/basemap-styles -- see for map styles
    this.streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      zIndex: 1}).addTo(this.map);
    // this.maplabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    // 	subdomains: 'abcd',
    // 	maxZoom: 19,
    //   zIndex: 3}).addTo(this.map);
    //Initialize geoJsonLayer for camera movement
    this.geoJsonLayer = L.geoJSON();
    this.sat = true;
    this.setBaseLayer();
    this.centralService.getGeoCoderData();
    this.centralService.getCityBounds();
  }

  changed(siteCatChosen){
    /** Fired when there is a change in the selection of the radio button */
    if(this.shapeLayer !== undefined){
        this.shapeLayer.settings.color = (index: Number, feature: JsonForm) => {
          if(siteCatChosen === feature.properties.SiteCat1){
            return L1.color.fromHex(this.getColors(siteCatChosen));
          } else if(siteCatChosen === "All"){
            return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
          } else {
            return L1.color.grey;
          }
        }
        this.shapeLayer.setup().render();
    }
  }

  sub(){
     this.centralService.geometryData.subscribe(
      view => {
        if(view.length > 1){
          var allFeatures = view[0];
          var temp;
          for(var index in view){
            temp = view[index].features;
            allFeatures.features = temp.concat(allFeatures.features);
          }
          this.recentData = allFeatures;
        }else if(Array.isArray(view)){
          this.recentData = view[0];
        }else{
          this.recentData = view;
        }
          this.geoJsonLayer = L.geoJSON();
          this.geoJsonLayer.addData(this.recentData);
          var latLngBounds = this.geoJsonLayer.getBounds();
          this.setShapeLayer(this.recentData);
          this.map.flyToBounds(latLngBounds,{duration:0.6,easeLinearity:1.0});
          this.centralService.showSpinner.next(false);
      });
      this.centralService.geocoderData.subscribe(
        data => {
          for(let feature of data.features){
            this.centralService.neighborhoodBoundaries.push({"coordinates": feature.geometry.coordinates[0],
            "name":feature.properties.SPA_NAME});
          }
         }
      );
      this.centralService.cityBounds.subscribe(
        data => {
          for(let feature of data.features){
            this.centralService.cityBoundaries.push({"coordinates": feature.geometry.coordinates[0],
            "name":feature.properties.NAME});
          }
         }
      );
      this.centralService.lassoGeometryData.subscribe(
        data => {
          this.cityHoodLassoData = data;
          var matches = [];
          if(this.cityHoodLassoData){
            for(var posts of this.cityHoodLassoData){
              for(var parcels of posts.features){
                for(var point of parcels.geometry.coordinates[0][0]){
                  if(inside(point,this.lassoPoints)){
                    matches.push(parcels.properties.parcelpin);
                    break;
                  }
                }
              }
            }
          }
          if(this.selectedParcels.length){
            this.selectedParcels = matches;
          }else{
            this.selectedParcels.concat(matches);
          }
          let toolData = [...this.selectedParcels];
          if(this.selectfeature !== undefined) this.selectfeature.removeAllArea();
          this.centralService.setParcelArray(toolData);
          this.centralService.getbyParcelpins(this.cities,this.neighborhoods); // this will initiate a http request which will update subscription
          this.selectedParcels = [];
          toolData = [];
        }
      );
      //commented out for later global use
      // this.centralService.currentSiteCat.subscribe(
      //   siteCat1 => {
      //     this.currentSiteCat = siteCat1;
      //     this.changed();
      //   });
  }
  setShapeLayer(parcels){
    if(this.shapeLayer !== undefined) this.shapeLayer.remove();

    this.shapeLayer = L1.shapes({
      data: parcels,
      map: this.map,
      opacity: 0.7,
      click: (e, feature : JsonForm) => { // fired everytime a feature is clicked
        this.feature = feature;
        let popupContent = "<table class='table table-sm table-striped table-bordered'>" + "<tbody>" +
          "<tr>" + "<td>Address</td><td>" + feature.properties.par_addr_a + "</td></tr>" +
          "<tr>" + "<td>Total SqFt</td><td>" + this.cp.transform(feature.properties.total_squa,"USD","","1.0-0") + "</td></tr>" +
          "<tr>" + "<td>Owner</td><td>" + feature.properties.deeded_own2 + "</td></tr>" +
          "<tr>" + "<td>Land Use</td><td>" + feature.properties.SiteCat1 + "</td></tr>" +
          "<tr>" + "<td>Sub-Cat</td><td>" + feature.properties.SiteCat2 + "</td></tr>" +
          "<tr>" + "<td>Parcel Pin</td><td>" + feature.properties.parcelpin + "</td></tr></tbody></table>";
        /** do something when a shape is clicked **/
        if(this.selectionToggle){
          // add the parcel number to an array when clicked and selection tool is toggled
          //this data will be used after pressing go
          if(!this.selectedParcels.includes(feature.properties.parcelpin)){
            this.selectedParcels.push(feature.properties.parcelpin);
          } else {
            this.selectedParcels = this.selectedParcels.filter((x) => x !== feature.properties.parcelpin);
          }
        }
        this.shapeLayer.settings.color =  (index, feature : JsonForm) => {
            let pin = feature.properties.parcelpin;
            if(!this.selectionToggle && !this.lassoToggle){
              if(this.feature.properties.parcelpin === pin){
                return L1.color.fromHex(this.getColors(this.feature.properties.SiteCat1));
              } else {
                return L1.color.grey;
              }
            } else {
              if(this.selectedParcels.includes(pin)){
                return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
              } else {
                return L1.color.grey;
              }
            }
        }
        if(!this.lassoToggle && !this.selectionToggle){
          L.popup().setLatLng(e.latlng)
          .setContent(popupContent).openOn(this.map);
        }
        this.shapeLayer.setup().render(); //slow because of resetVertices

      },
      border: true,
      color: (index : Number, feature : JsonForm) => {
        //this will take a feature and map its sitecat zone to a color
        return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
      }
    });
  }
  getColors(zoneType){
    switch(zoneType){
      case "Residential":
        return "#E5BE77";
      case "Commercial":
        return "#FF4C4C";
      case "Industrial":
        return "#BE69F2";
      case "Mixed":
        return "#fd8f45";
      case "Government":
        return "#7A7ACB";
      case "Institutional":
        return "#3D3DCB";
      case "Utility":
        return "#F1F1F199";
      case "All":
        return "#0"
      default:
        return "#40404099";
    }
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

  //add check initialized/undefined flags
  getLassoPlots(){
    this.centralService.showSpinner.next(true);
    //starts enhancedLasso process
    if(this.cities && this.centralService.enhancedLasso){
      this.centralService.getLassoGeometryData(this.cities,this.neighborhoods);
    }else if(!this.centralService.enhancedLasso && this.recentData !== undefined){
      // console.log("reached");
      let toolData = [...this.selectedParcels];
      if(this.selectfeature !== undefined) this.selectfeature.removeAllArea();
      this.centralService.setParcelArray(toolData);
      this.centralService.getbyParcelpins(this.cities,this.neighborhoods); // this will initiate a http request which will update subscription
      this.selectedParcels = [];
      toolData = [];
    }else{
      //To-Do:: no data loaded or selected should alert user maybe alert or popup
      console.log("no data entered");
      this.centralService.showSpinner.next(false);
    }
  }
  removeLassoPolygons(){
    if(this.selectfeature !== undefined) this.selectfeature.removeAllArea();
    this.selectedParcels = [];
    this.centralService.setParcelArray([]);
    this.cityHoodLassoData = [];
    if(this.recentData !== undefined){
      this.centralService.showSpinner.next(true);
      this.centralService.getGeometry();
      this.centralService.getViews();
    }
  }
  addLassoData(){ //fired
    this.lassoPoints = [];
    let latlng_area = this.selectfeature.getAreaLatLng();
    for(let latlng of latlng_area){
      let temp = [latlng.lng,latlng.lat];
      this.lassoPoints.push(temp);
    }
    if(this.lassoPoints === null || this.lassoPoints.length == 0) {
      throw new Error("temp array is empty");
    }
    //declare arrays of city/hood names lasso points are within
    this.cities = this.centralService.pointInsideBounds(this.lassoPoints,this.centralService.cityBoundaries);
    this.neighborhoods = this.centralService.pointInsideBounds(this.lassoPoints,this.centralService.neighborhoodBoundaries);
    // console.log(this.cities);
    let feature = [];
    let allPoints = 0;
    if(this.recentData !== undefined){
      for(let i = 0; i < this.recentData.features.length;i++){ // for each feature in features
        feature = this.recentData.features[i].geometry.coordinates;
        for(let j = 0; j < feature.length;j++){ //for each polygon in feature
          for(let k = 0; k < feature[j].length; k++  ){ //for each hole in polygon
            allPoints = 0;
            for(let l = 0; l < feature[j][k].length; l++){ // for each point in polygon
              if(inside(feature[j][k][l],this.lassoPoints)){
                allPoints+=1;
                if(!this.selectedParcels.includes(this.recentData.features[i].properties.parcelpin) && allPoints == feature[j][k].length){
                  this.selectedParcels.push(this.recentData.features[i].properties.parcelpin);
                }}}}}
      }
      this.shapeLayer.settings.color = (e, feature: JsonForm) => { // change color of the circled parcels
        if(this.selectedParcels.includes(feature.properties.parcelpin)){
          return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
        } else {
          return L1.color.grey;
        }
      }
      this.shapeLayer.setup().render();
    }
  }

  toggleTool(tool: String){
    if(tool === "select"){ // then toggle selection tool
      if(this.selectionToggle){
        this.selectionToggle = false;
      }else{
        this.selectionToggle = true;
      }
      if(this.lassoToggle) {
        this.map.selectAreaFeature.disable();
        this.lassoToggle = false;
        this.map.off("mouseup");
      }
    } else if(tool === "lasso"){ // then toggle lasso tool
      if(this.lassoToggle){
        this.lassoToggle = false;
        this.map.selectAreaFeature.disable();
        this.map.off("mouseup");
      }else{
        this.selectfeature = this.map.selectAreaFeature.enable();
        this.lassoToggle = true;
        this.map.on("mouseup", this.addLassoData, this);
      }
      if(this.selectionToggle) this.selectionToggle = false;
    }
  }


}
