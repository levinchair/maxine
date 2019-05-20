var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
var CitiesService = /** @class */ (function () {
    function CitiesService(http) {
        this.http = http;
        this.citiesUpdated = new Subject();
    }
    CitiesService.prototype.getCity = function () {
        var _this = this;
        this.http.get('http://localhost:3000/showcities/')
            .subscribe(function (cityData) {
            _this.cities = cityData;
            _this.citiesUpdated.next(_this.cities.slice());
            // console.log(this.cities);          
        });
        return this.citiesUpdated.asObservable();
    };
    CitiesService = __decorate([
        Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [HttpClient])
    ], CitiesService);
    return CitiesService;
}());
export { CitiesService };
//# sourceMappingURL=cities.service.js.map