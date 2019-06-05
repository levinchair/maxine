import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';

//Models
import { JsonForm } from '../../model/jsonform.model';

import * as L from 'leaflet';
import * as L1 from 'leaflet.glify';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  features: any;
  map: any;
  geoJsonLayer;
  layerGroup: any;
  html_city: String;
  html_neighborhood: String;
  constructor(
    private centralService : CentralService
  ) { }

  ngOnInit() {
    //Initialize Map
    this.map = L.map('map').setView([41.4843,-81.9332], 10);
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png').addTo(this.map);
    //Initialize geoJsonLayer
    this.geoJsonLayer = L.geoJSON();
  }

  updateAllData(){
    this.centralService.getChartData();
    this.centralService.getGeometry().subscribe(
        data  => {
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
          L1.shapes({
            data: data,
            map: this.map,
            opacity: 0.85,
            click:(e, feature) => {
              //do something when a shape is clicked
              L.popup().setLatLng(e.latlng)
                .setContent("ParcelPin: " + feature.properties.PARCELPIN +
                " SiteCat1: " + feature.properties.SiteCat1).openOn(this.map);
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

}
