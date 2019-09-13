import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';
import inside from 'point-in-polygon';
//Models
import { JsonForm } from '../../model/jsonform.model';
import * as L from 'leaflet';
import 'leaflet-selectareafeature/dist/Leaflet.SelectAreaFeature.js'; // strictly import dist
import * as L1 from 'leaflet.glify';
import { NeighborhoodBoundaries } from '../../assets/data/cle_neighborhoods';

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
  neighborhoodBoundaries = [];
  html_city: String;
  html_neighborhood: String;
  latlng_area:any;
  selectfeature:any;
  EPSILON = 0.00001;
  recentData:any;
  toolData : any[];
  sat: boolean;
  googleSat: any;
  maplabels:any;
  streets: any;
  lassoToggle:boolean = false;
  selectionToggle: boolean = false;
  selectedParcels: String[] = [];
  feature : JsonForm;
  landuse: String[];
  marker:any;
  currentSiteCat:String;

  constructor(
    private centralService : CentralService,
  ){}

  ngOnInit() {

    this.landuse = this.centralService.getLanduse();

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
    //Neighborhood layers
    var hBoundaries = new NeighborhoodBoundaries();
    console.log(hBoundaries.data);
    for(var k = 0; k < hBoundaries.data.records.length; k++){
      var tempPolygon = hBoundaries.data.records[k].fields.geo_shape.coordinates[0];
      for(var i = 0; i < tempPolygon.length; i++){
        var tempVal = tempPolygon[i][1];
        tempPolygon[i][1] = tempPolygon[i][0];
        tempPolygon[i][0] = tempVal;
      }
      this.neighborhoodBoundaries.push(
        [ hBoundaries.data.records[k].fields.city,
          hBoundaries.data.records[k].fields.name,
          tempPolygon
        ]);
    }
  }
  changed(){
    /** Fired when there is a change in the selection of the radio button */
    // console.log(this.centralService.currentSiteCat);
    if(this.shapeLayer !== undefined){
        this.shapeLayer.settings.color = (index: Number, feature: JsonForm) => {
          if(this.currentSiteCat === feature.properties.SiteCat1){
            return L1.color.fromHex(this.getColors(this.currentSiteCat));
          } else if(this.currentSiteCat === "All"){
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
        this.recentData = view;
        this.geoJsonLayer = L.geoJSON();
        this.geoJsonLayer.addData(view);
        var latLngBounds = this.geoJsonLayer.getBounds();
        this.map.flyToBounds(latLngBounds,{duration:0.6,easeLinearity:1.0});
        this.setShapeLayer(view);
      });
      this.centralService.geocoderData.subscribe(
        data => {
          //Given search bar address lng/lat [Number,Number]
          //Create Neighborhood Layers and run Point in Polygon
          var hood = this.neighborhoodBoundaries;
          for(var i = 0; i < hood.length;i++){
            // console.log(inside(data,hood[i][2]));
            if(inside(data,hood[i][2])){
              //console.log(hood[i][0] + " " + hood[i][1]);
              //Found neighborhood
              this.centralService.showSpinner.next(true);
              this.centralService.search = "";
              this.centralService.setCity(hood[i][0]);
              this.centralService.setHood(hood[i][1]);
              this.centralService.getGeometry();
              this.centralService.getViews();
              break;
            }
          }
          if(i == hood.length){
            //No neighborhood found Let user know
            this.centralService.search = "Address not within our Database";
          }
          if(this.marker === undefined){
            this.marker = L.marker(data).addTo(this.map);
          }else{
            this.marker.setLatLng(data);
          }
        }
      );
      this.centralService.currentSiteCat.subscribe(
        siteCat1 => {
          this.currentSiteCat = siteCat1;
          this.changed();
        });
  }
  setShapeLayer(parcels){
    if(this.shapeLayer !== undefined) this.shapeLayer.remove();

    this.shapeLayer = L1.shapes({
      data: parcels,
      map: this.map,
      opacity: 0.7,
      click:(e, feature : JsonForm) => {
        this.feature = feature;
        let popupContent = "<p>" +
          "<b>Parcel Pin</b> : " + feature.properties.parcelpin + "<br>" +
          "<b>Land Use</b>   : " + feature.properties.SiteCat1 + "<br>" +
          "<b>-> Sub-Category</b> : " + feature.properties.SiteCat2 + "<br>" +
          "<b>Address</b>    : " + feature.properties.par_addr_a + "<br>" +
          "<b>Total SqFt</b> : " + feature.properties.total_squa + "<br>" +
          "<b>Owner</b>      : " + feature.properties.deeded_own2 + "</p>";
        /** do something when a shape is clicked **/
        if(this.selectionToggle){
          // add the parcel number to an array when clicked and selection tool is toggled
          //this data will be used after pressing go
          // console.log(feature.properties.parcelpin);
          if(!this.selectedParcels.includes(feature.properties.parcelpin)){
            this.selectedParcels.push(feature.properties.parcelpin);
          } else {
            this.selectedParcels = this.selectedParcels.filter((x) => x !== feature.properties.parcelpin);
            console.log(this.selectedParcels);
          }
        }
        this.shapeLayer.settings.color = (index, feature : JsonForm) => {
            let pin = feature.properties.parcelpin;
            if(!this.selectionToggle){
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
            // if(this.selectedParcels.includes(pin)){
            //   return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
            // } else if(this.feature.properties.parcelpin === pin){
            //   if(!this.selectionToggle) return L1.color.fromHex(this.getColors(feature.properties.SiteCat1));
            // }else{
            //   return L1.color.grey;
            // }
        }
        //console.log("value of lassotoggle: %s, value of selectionToggle: %s", this.lassoToggle, this.selectionToggle);
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
    //console.log(zoneType);
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
    let toolData = [];
    if(this.lassoToggle){
          if(this.selectfeature === undefined) {
          alert("Please use lasso to select an area");
          this.latlng_area = [];
          
        }else {
          this.latlng_area = this.selectfeature.getAllAreaLatLng();
          console.log(this.selectfeature.getFeaturesSelected());
        }
        let tempArray = [];
        // console.log(this.latlng_area.length);
        for(let area of this.latlng_area){
            console.log(area);
            for(let q = 0; q < area.length; q++){
              let temp = [area[q].lng,area[q].lat]
              tempArray.push(temp);
            }
        }
        console.log("temparray: " + JSON.stringify(tempArray));
        if(tempArray === null || tempArray.length == 0) {
          throw new Error("temp array is empty");
        }
        //recent 
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
                  if(!toolData.includes(this.recentData.features[i]) && allPoints == feature[j][k].length){
                    toolData.push(this.recentData.features[i].properties.parcelpin);
                  }
                }
              }
            }
          }
        }

    } else if(this.selectionToggle){
      console.log(this.selectedParcels);
      toolData.push(...this.selectedParcels);
    }
    if (!toolData || toolData.length == 0) {
      alert("No parcels were selected");
    } else {
      this.centralService.showSpinner.next(true)
      this.centralService.setParcelArray(toolData);
      this.centralService.getbyParcelpins(); // this will initiate a http request which will update subscription
    }

  }
  removeLassoPolygons(){
    if(this.selectfeature !== undefined) this.selectfeature.removeAllArea();
    this.selectedParcels = [];
    this.centralService.setParcelArray([]);
    this.centralService.showSpinner.next(true);
    this.centralService.getGeometry();
    this.centralService.getViews();
  }

  toggleTool(tool: String){
    if(tool === "select"){ // then toggle selection tool
      if(this.selectionToggle){
        this.selectionToggle = false;
      }else{
        this.selectionToggle = true;
      }

      if(this.lassoToggle) {
        this.lassoToggle = false;
        this.map.selectAreaFeature.disable();
      }
    } else if(tool === "lasso"){ // then toggle lasso tool
      if(this.lassoToggle){
        this.lassoToggle = false;
        this.map.selectAreaFeature.disable();
        console.log(this.map.selectAreaFeature.disable());
      }else{
        console.log(this.map.selectAreaFeature.enable());
        this.selectfeature = this.map.selectAreaFeature.enable();
        this.lassoToggle = true;
      }
      if(this.selectionToggle) this.selectionToggle = false;
      
    }
  }
}
