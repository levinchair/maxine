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
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
var GeojsonDataService = /** @class */ (function () {
    function GeojsonDataService(_http) {
        this._http = _http;
        // location of geojson file in the server
        this._url = '../assets/combinedWithLodes.json';
    }
    GeojsonDataService.prototype.getGeoJsonData = function () {
        return this._http.get(this._url)
            .pipe(map(function (response) { return response.json(); }));
    };
    GeojsonDataService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [Http])
    ], GeojsonDataService);
    return GeojsonDataService;
}());
export { GeojsonDataService };
//# sourceMappingURL=geojson-data.service.js.map