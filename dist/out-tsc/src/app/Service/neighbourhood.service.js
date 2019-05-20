var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CitiesService } from './cities.service';
var NeighbourhoodService = /** @class */ (function () {
    function NeighbourhoodService(http, cityService) {
        this.http = http;
        this.cityService = cityService;
        this.neighbourhoodUpdated = new Subject();
        this.selectedHood = null;
    }
    NeighbourhoodService.prototype.setSelectedcity = function (selectedCity) {
        this.selectedCity = selectedCity;
    };
    NeighbourhoodService.prototype.getSelectedCity = function () {
        return this.selectedCity;
    };
    NeighbourhoodService.prototype.setSelectedHood = function (selectedHood) {
        this.selectedHood = selectedHood;
    };
    NeighbourhoodService.prototype.getSelectedHood = function () {
        return this.selectedHood;
    };
    NeighbourhoodService.prototype.setOnselectFlag = function (onSelectflag) {
        this.onSelectFlag = onSelectflag;
    };
    NeighbourhoodService.prototype.getOnSelectFlag = function () {
        return this.onSelectFlag;
    };
    NeighbourhoodService.prototype.getNeighbourhood = function (city) {
        var _this = this;
        this.selectedCity = city;
        this.http.get("http://localhost:3000/showhood/" + this.selectedCity)
            .subscribe(function (neighbourhoodData) {
            _this.neighbourhood = neighbourhoodData;
            _this.neighbourhoodUpdated.next(_this.neighbourhood.slice());
        });
        return this.neighbourhoodUpdated.asObservable();
    };
    // this is the ulitmate method to get selected city and selected hood from neighbourhood component
    NeighbourhoodService.prototype.sendCity = function (_city) {
        this._city = _city;
        console.log(this._city);
        return this._city;
    };
    NeighbourhoodService.prototype.sendNeighborhood = function (_hood) {
        this._hood = _hood;
        console.log(this._hood);
        return this._hood;
    };
    NeighbourhoodService.prototype.getCity = function () {
        console.log("printed after getting value in getCity()", this._city);
        return this._city.asObservable();
    };
    NeighbourhoodService.prototype.getNeighborhood = function () {
        console.log("printed after getting value in getNeighborhood()", this._hood);
        return this._hood.asObservable();
    };
    NeighbourhoodService = __decorate([
        Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [HttpClient,
            CitiesService])
    ], NeighbourhoodService);
    return NeighbourhoodService;
}());
export { NeighbourhoodService };
//# sourceMappingURL=neighbourhood.service.js.map