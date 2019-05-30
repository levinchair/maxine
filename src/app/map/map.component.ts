import { Component, Input, ViewChild, NgZone, OnInit, HostBinding } from '@angular/core';
import { MapsAPILoader, AgmMap, AgmDataLayer 	} from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { LocationService } from '../Service/location.service';
import { wrappedError } from '@angular/core/src/error_handler';
 
import { GeometryService } from '../Service/geometry.service';
import { featureCollection } from  "../../model/featurecollection.model";
 
declare var google: any;
 
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}
 

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
  })
  export class MapComponent {
	error: any;
	layer: featureCollection;
    circleRadius:number = 1000;
    flag;
    geocoder:any;
    private _isMoreMap: boolean;
    @HostBinding('class.is-open')
    isOpen = false;
    public location:Location = {
      lat: 51.678418,
      lng: 7.809007,
      marker: {
        lat: 51.678418,
        lng: 7.809007,
        draggable: true
      },
      zoom: 5
    };
   
    // @ViewChild(AgmMap) map: AgmMap;
    @ViewChild(AgmMap) map: any;
  header: string;
    constructor(
	  private geometryService: GeometryService,
	  public mapsApiLoader: MapsAPILoader,
      private zone: NgZone,
      private wrapper: GoogleMapsAPIWrapper, 
	  private locationService: LocationService) {
            this.mapsApiLoader = mapsApiLoader;
            this.zone = zone;
            this.wrapper = wrapper;
            this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
            });
      }
    ngOnInit() {
        this.location.marker.draggable = true;
       
    }
    mapReady(event: any) {
      this.map = event;
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('search'));
    }
	
	//this function will get the geometry and store in layer var array
	showGeometry() {
		this.geometryService.getGeometry()
			.subscribe( //subscribe is async since its waiting for http resp
				data  => {
					this.layer = data;
					//alert(JSON.stringify(this.layer));
				}		
			);
	}
	
    updateOnMap() {
	
	  this.showGeometry();
	  
      this.flag=this.locationService.getFlag();
      //console.log(" Map Flag: ",this.flag);
      let full_address:string 
      if(this.flag)
      {
        
        this.location.address_level_1=this.locationService.sendCity();
        this.location.address_level_2= this.locationService.sendHood();
        this.location.address_state="";
        this.location.address_country="USA";
      }
      
      else{
        this.header=this.locationService.getHeader();
        var splitHeader=this.header.split(",");
        console.log("splitHeader: ",splitHeader);
        if(splitHeader.length==4)
        {
          this.location.address_level_1=splitHeader[0];
          this.location.address_level_2=splitHeader[1];
          this.location.address_state=splitHeader[2].split(" ")[0];
          this.location.address_country=splitHeader[3];

        }
        else if(splitHeader.length==3)
        {
          this.location.address_level_1="";
          this.location.address_level_2=splitHeader[0];
          this.location.address_state=splitHeader[1].split(" ")[0];
          this.location.address_country=splitHeader[2];
        }
      }
      console.log("flag:",this.flag);
      full_address= this.location.address_level_1 || ""
      if (this.location.address_level_2) full_address = full_address + " " + this.location.address_level_2
      if (this.location.address_state) full_address = full_address + " " + this.location.address_state
      if (this.location.address_country) full_address = full_address + " " + this.location.address_country
      this.flag=false;
      this.header="";
      this.findLocation(full_address);
	  
    }
    
    findLocation(address) {
      if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
      this.geocoder.geocode({
        'address': address
      }, (results, status) => {
        //console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
          for (var i = 0; i < results[0].address_components.length; i++) {
            let types = results[0].address_components[i].types
   
            if (types.indexOf('locality') != -1) {
              this.location.address_level_2 = results[0].address_components[i].long_name
            }
            if (types.indexOf('country') != -1) {
              this.location.address_country = results[0].address_components[i].long_name
            }
            if (types.indexOf('postal_code') != -1) {
              this.location.address_zip = results[0].address_components[i].long_name
            }
            if (types.indexOf('administrative_area_level_1') != -1) {
              this.location.address_state = results[0].address_components[i].long_name
            }
          }
   
          if (results[0].geometry.location) {
            this.location.lat = results[0].geometry.location.lat();
            this.location.lng = results[0].geometry.location.lng();
            this.location.marker.lat = results[0].geometry.location.lat();
            this.location.marker.lng = results[0].geometry.location.lng();
            this.location.marker.draggable = true;
            this.location.viewport = results[0].geometry.viewport;
          }
          
        } else {
          alert("Sorry, this search produced no results.");
        }
      })
    }

    markerDragEnd(m: any, $event: any) {
      this.location.marker.lat = m.coords.lat;
      this.location.marker.lng = m.coords.lng;
     }
    setStylesMapView(){
          let stylesMapView= {
            'height': this.isOpen ? '50vh':'90vh',
            'width': this.isOpen ? '40vw':'80%',
            'float': 'left',
            'box-sizing': 'border-box',
            'background': 'whitesmoke'
          };
          return stylesMapView;
    }
  }