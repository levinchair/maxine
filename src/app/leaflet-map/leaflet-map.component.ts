import { Component, OnInit } from '@angular/core';
import { GeometryService } from '../Service/geometry.service';
import { featureCollection } from  "../../model/featurecollection.model";

import * as L from 'leaflet';
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
  constructor(
    private geometryService: GeometryService
  ) { }

  ngOnInit() {
    this.map = L.map('map').setView([41.4843,-81.9332], 10);
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">wikimedia</a>'
    }).addTo(this.map);
    this.geoJsonLayer = L.geoJSON().addTo(this.map);
  }

  showGeometry(){
    this.geometryService.getGeometry()
      .subscribe( //subscribe is async since its waiting for http resp
				data  => {
					this.geoJsonLayer.addData(data);
          //gets the maximum view size for map
          var latLngBounds = this.geoJsonLayer.getBounds();
          this.map.fitBounds(latLngBounds);
				}
			);
  }

  updateOnMap(){
    //removes layer from map
    this.geoJsonLayer.removeFrom(this.map);
    //re-initializes layer
    this.geoJsonLayer = L.geoJSON().addTo(this.map);
    this.showGeometry();
  }

}
