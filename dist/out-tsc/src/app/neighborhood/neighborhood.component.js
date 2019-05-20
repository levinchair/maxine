var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import { DataTableService } from '../Service/data-table.service';
import { DataTable2Service } from '../Service/data-table2.service';
import { DataTable3Service } from '../Service/data-table3.service';
import { DataTable4Service } from '../Service/data-table4.service';
import { LocationService } from '../Service/location.service';
var NeighborhoodComponent = /** @class */ (function () {
    function NeighborhoodComponent(neighbourhoodService, dataTableService, dataTable2Service, dataTable3Service, dataTable4Service, locationService) {
        this.neighbourhoodService = neighbourhoodService;
        this.dataTableService = dataTableService;
        this.dataTable2Service = dataTable2Service;
        this.dataTable3Service = dataTable3Service;
        this.dataTable4Service = dataTable4Service;
        this.locationService = locationService;
        this.selectedHood = null;
        this.onSelectFlag = false;
        this.neighbourhood = [];
        this._neighbourhood = null;
    }
    NeighborhoodComponent.prototype.onSelect = function (hood) {
        this.neighbourhoodService.setOnselectFlag(true);
        this.selectedCity = this.neighbourhoodService.getSelectedCity();
        this._neighbourhood = hood;
        console.log("neighborhood.component.ts", this._neighbourhood, "-->", this.selectedCity); //finally, you are here!
        this.neighbourhoodService.setSelectedHood(this._neighbourhood);
        // this.neighbourhoodService.sendCity(this.selectedCity);
        // this.neighbourhoodService.sendNeighborhood(this._neighbourhood);
        // this.dataTableService.setData(this.selectedCity, this._neighbourhood);
        this.dataTableService.setCity(this.selectedCity);
        this.dataTable2Service.setCity(this.selectedCity);
        this.dataTable3Service.setCity(this.selectedCity);
        this.dataTable4Service.setCity(this.selectedCity);
        this.locationService.setCity(this.selectedCity);
        this.dataTableService.setHood(this._neighbourhood);
        this.dataTable2Service.setHood(this._neighbourhood);
        this.dataTable3Service.setHood(this._neighbourhood);
        this.dataTable4Service.setHood(this._neighbourhood);
        this.locationService.setHood(this._neighbourhood);
        this.locationService.setFlag();
        // this.locationService.addLocation(36.5323,116.9325);
        this.locationService.getLocation();
    };
    NeighborhoodComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.selectedCity = this.neighbourhoodService.getSelectedCity();
        this.neighbourhoodService.getNeighbourhood(this.selectedCity)
            .subscribe(function (neighborhood) {
            _this.neighbourhood = neighborhood;
        });
        this.neighbourhoodService.setOnselectFlag(false);
    };
    NeighborhoodComponent = __decorate([
        Component({
            selector: 'app-neighborhood',
            template: "  \n  <ul>\n    <li *ngFor= \"let hood of neighbourhood\"\n    (click)=\"onSelect(hood)\">      \n    <a routerLink=\"/view1/{{city}}/{{hood}}\">{{hood | uppercase}} </a> \n    </li>\n  </ul> \n   ",
            styleUrls: ['./neighborhood.component.css']
        }),
        __metadata("design:paramtypes", [NeighbourhoodService,
            DataTableService,
            DataTable2Service,
            DataTable3Service,
            DataTable4Service,
            LocationService])
    ], NeighborhoodComponent);
    return NeighborhoodComponent;
}());
export { NeighborhoodComponent };
//# sourceMappingURL=neighborhood.component.js.map