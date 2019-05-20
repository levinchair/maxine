var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { LocationService } from '../Service/location.service';
var MapComponent = /** @class */ (function () {
    function MapComponent(mapsApiLoader, zone, wrapper, locationService) {
        var _this = this;
        this.mapsApiLoader = mapsApiLoader;
        this.zone = zone;
        this.wrapper = wrapper;
        this.locationService = locationService;
        this.circleRadius = 5000;
        this.location = {
            lat: 51.678418,
            lng: 7.809007,
            marker: {
                lat: 51.678418,
                lng: 7.809007,
                draggable: true
            },
            zoom: 5
        };
        this.mapsApiLoader = mapsApiLoader;
        this.zone = zone;
        this.wrapper = wrapper;
        this.mapsApiLoader.load().then(function () {
            _this.geocoder = new google.maps.Geocoder();
        });
    }
    MapComponent.prototype.ngOnInit = function () {
        this.location.marker.draggable = true;
    };
    MapComponent.prototype.updateOnMap = function () {
        this.flag = this.locationService.getFlag();
        // let full_address:string = this.location.address_level_1 || ""
        if (this.flag) {
            this.location.address_level_1 = this.locationService.sendCity();
            this.location.address_level_2 = this.locationService.sendHood();
        }
        console.log("flag:", this.flag);
        // else{
        //   if (this.location.address_level_2) full_address = full_address + " " + this.location.address_level_2
        // if (this.location.address_state) full_address = full_address + " " + this.location.address_state
        // if (this.location.address_country) full_address = full_address + " " + this.location.address_country
        // }
        var full_address = this.location.address_level_1 || "";
        if (this.location.address_level_2)
            full_address = full_address + " " + this.location.address_level_2;
        if (this.location.address_state)
            full_address = full_address + " " + this.location.address_state;
        if (this.location.address_country)
            full_address = full_address + " " + this.location.address_country;
        this.flag = false;
        this.findLocation(full_address);
    };
    MapComponent.prototype.findLocation = function (address) {
        var _this = this;
        if (!this.geocoder)
            this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            'address': address
        }, function (results, status) {
            console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var types = results[0].address_components[i].types;
                    if (types.indexOf('locality') != -1) {
                        _this.location.address_level_2 = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('country') != -1) {
                        _this.location.address_country = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('postal_code') != -1) {
                        _this.location.address_zip = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('administrative_area_level_1') != -1) {
                        _this.location.address_state = results[0].address_components[i].long_name;
                    }
                }
                if (results[0].geometry.location) {
                    _this.location.lat = results[0].geometry.location.lat();
                    _this.location.lng = results[0].geometry.location.lng();
                    _this.location.marker.lat = results[0].geometry.location.lat();
                    _this.location.marker.lng = results[0].geometry.location.lng();
                    _this.location.marker.draggable = true;
                    _this.location.viewport = results[0].geometry.viewport;
                }
                _this.map.triggerResize();
            }
            else {
                alert("Sorry, this search produced no results.");
            }
        });
    };
    MapComponent.prototype.markerDragEnd = function (m, $event) {
        this.location.marker.lat = m.coords.lat;
        this.location.marker.lng = m.coords.lng;
        this.findAddressByCoordinates();
    };
    MapComponent.prototype.findAddressByCoordinates = function () {
        var _this = this;
        this.geocoder.geocode({
            'location': {
                lat: this.location.marker.lat,
                lng: this.location.marker.lng
            }
        }, function (results, status) {
            _this.decomposeAddressComponents(results);
        });
    };
    MapComponent.prototype.decomposeAddressComponents = function (addressArray) {
        if (addressArray.length == 0)
            return false;
        var address = addressArray[0].address_components;
        for (var _i = 0, address_1 = address; _i < address_1.length; _i++) {
            var element = address_1[_i];
            if (element.length == 0 && !element['types'])
                continue;
            if (element['types'].indexOf('street_number') > -1) {
                this.location.address_level_1 = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('route') > -1) {
                this.location.address_level_1 += ', ' + element['long_name'];
                continue;
            }
            if (element['types'].indexOf('locality') > -1) {
                this.location.address_level_2 = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('administrative_area_level_1') > -1) {
                this.location.address_state = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('country') > -1) {
                this.location.address_country = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('postal_code') > -1) {
                this.location.address_zip = element['long_name'];
                continue;
            }
        }
    };
    __decorate([
        ViewChild(AgmMap),
        __metadata("design:type", AgmMap)
    ], MapComponent.prototype, "map", void 0);
    MapComponent = __decorate([
        Component({
            selector: 'app-map',
            templateUrl: './map.component.html',
            styleUrls: ['./map.component.css'],
        }),
        __metadata("design:paramtypes", [MapsAPILoader,
            NgZone,
            GoogleMapsAPIWrapper, LocationService])
    ], MapComponent);
    return MapComponent;
}());
export { MapComponent };
// import { LocationService } from '../Service/location.service';
// import { GeojsonDataService } from '../Service/geojson-data.service';
// import { Location } from '../../model/location.model';
// import { Component, OnInit, HostBinding } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { MapsAPILoader, AgmDataLayer, AgmMap } from '@agm/core';
// import { ToggleService } from '../Service/toggle.service';
// /// <reference types="@types/googlemaps" />
// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.css'],
//   providers: [LocationService, GeojsonDataService]
// })
// export class MapComponent implements OnInit {  
//   geoJson: Object;
//   zoom = 12;
//   location: Subscription;
//   private latitude: number;
//   private longitude: number;
//   @HostBinding('class.is-open')
//     isOpen = false;
//   constructor(private locationService: LocationService,
//      private _geoJsonData: GeojsonDataService,
//      private toggleService: ToggleService) { }
//   getGeoJson() {
//     this._geoJsonData.getGeoJsonData()
//       .subscribe( resGeoData => {
//         this.geoJson = resGeoData;
//         // console.log("geojson",this.geoJson)
//       });
//   }
//   getLocation() {
//     console.log('This is from map component : getLocation ');   
//     this.location= this.locationService.getLocation()
//       .subscribe( (a: Location) => {
//         console.log('inside subscriber');
//         this.latitude=a.latitude;
//         this.longitude=a.longitude
//         // console.log('This is from map component ', this.latitude,this.longitude);
//       });
//       console.log("Location",this.location);
//   }
//   getToggle() {
//     this.toggleService.change.subscribe(isOpen => {
//       this.isOpen = isOpen;
//       // txhis.getLocation();
//       // console.log('map toggle ',this.isOpen);
//     });
//   }
//   ngOnInit() {
//     console.log('SEEMS MAP COMPONENT INIT IS WORKING!');
//     this.getGeoJson();
//     this.getToggle();
//     this.getLocation();
//   }
//   ngAfterViewChecked() {
//     // this.getLocation()
//   }
//   setStylesMapView(){
//     let stylesMapView= {
//       'height': this.isOpen ? '50vh':'90vh',
//       'width': this.isOpen ? '40vw':'80%',
//       'float': 'left',
//       'box-sizing': 'border-box',
//       'background': 'whitesmoke'
//     };
//     return stylesMapView;
//   }
//   setStylesMapInit(){
//     let stylesMapInit= {
//       'height': '100vh',
//       'width': 'inherit'
//     };
//     return stylesMapInit;
//   }
// }
//# sourceMappingURL=map.component.js.map