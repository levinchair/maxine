var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation } from '@angular/core';
import { CitiesService } from '../Service/cities.service';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import { DataTableService } from '../Service/data-table.service';
import { DataTable2Service } from '../Service/data-table2.service';
import { DataTable3Service } from '../Service/data-table3.service';
import { DataTable4Service } from '../Service/data-table4.service';
var ControlPanelComponent = /** @class */ (function () {
    function ControlPanelComponent(cityService, neighbourhoodService, dataTableService, dataTable2Service, dataTable3Service, dataTable4Service) {
        this.cityService = cityService;
        this.neighbourhoodService = neighbourhoodService;
        this.dataTableService = dataTableService;
        this.dataTable2Service = dataTable2Service;
        this.dataTable3Service = dataTable3Service;
        this.dataTable4Service = dataTable4Service;
        this.cities = [];
        this.cityFromService = this.neighbourhoodService.getSelectedCity();
    }
    ControlPanelComponent.prototype.onSelect = function (city) {
        this.selectedCity = city;
        if (this.cityFromService === this.selectedCity) {
            console.log('selected from city service', this.cityFromService);
        }
        this.neighbourhoodService.setSelectedcity(this.selectedCity);
        this.dataTableService.setCity(this.selectedCity);
        // this.dataTableService.setHood(null);
        this.dataTable2Service.setCity(this.selectedCity);
        //this.dataTable2Service.setHood(null);
        this.dataTable3Service.setCity(this.selectedCity);
        //this.dataTable3Service.setHood(null);
        this.dataTable4Service.setCity(this.selectedCity);
        //this.dataTable4Service.setHood(null);
        // this.dataTableService.setHood(null);
        // this.dataTable2Service.setHood(null);
        // this.dataTable3Service.setHood(null);
        // this.dataTable4Service.setHood(null);
    };
    ControlPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.citiesSub = this.cityService.getCity()
            .subscribe(function (cities) {
            _this.cities = cities;
        });
    };
    ControlPanelComponent = __decorate([
        Component({
            selector: 'app-control-panel',
            templateUrl: './control-panel.component.html',
            styleUrls: ['./control-panel.component.css'],
            encapsulation: ViewEncapsulation.Emulated
        }),
        __metadata("design:paramtypes", [CitiesService, NeighbourhoodService, DataTableService, DataTable2Service, DataTable3Service, DataTable4Service])
    ], ControlPanelComponent);
    return ControlPanelComponent;
}());
export { ControlPanelComponent };
//# sourceMappingURL=control-panel.component.js.map