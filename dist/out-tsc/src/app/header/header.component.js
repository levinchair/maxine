var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LocationService } from '../Service/location.service';
import { Component, ElementRef, ViewChild, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
/// <reference types="@types/googlemaps" />
import { MapsAPILoader } from '@agm/core';
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(mapsAPILoader, ngZone, locationService) {
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.locationService = locationService;
        this.zoom = 5;
        this.latitude = 41.4995;
        this.longitude = -81.69541;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(function () {
            //@ts-ignore  
            var autocomplete = new google.maps.places.Autocomplete(_this.searchElementRef.nativeElement);
            autocomplete.addListener('place_changed', function () {
                //@ts-ignore  
                var place = autocomplete.getPlace();
                _this.search = place.formatted_address;
                _this.latitude = place.geometry.location.lat();
                _this.longitude = place.geometry.location.lng();
                _this.zoom = 12;
                _this.location = { latitude: _this.latitude, longitude: _this.longitude };
                // console.log('header.component.ts => ', this.search, this.location);
                _this.locationService.addLocation(_this.latitude, _this.longitude);
            });
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], HeaderComponent.prototype, "search", void 0);
    __decorate([
        ViewChild('search'),
        __metadata("design:type", ElementRef)
    ], HeaderComponent.prototype, "searchElementRef", void 0);
    HeaderComponent = __decorate([
        Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css'],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [MapsAPILoader,
            NgZone,
            LocationService])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map