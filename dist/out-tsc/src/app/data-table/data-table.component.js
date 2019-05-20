var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
import { ToggleService } from '../Service/toggle.service';
import { DataTableService } from 'src/app/Service/data-table.service';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(toggleService, neighborhoodService, dataTable, http) {
        this.toggleService = toggleService;
        this.neighborhoodService = neighborhoodService;
        this.dataTable = dataTable;
        this.http = http;
        this.isOpen = false;
        this.updatedData = new Subject();
        this.views = ['1', '2', '3', '4', '5'];
    }
    ;
    DataTableComponent.prototype.getValue = function () {
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        // console.log("city: ",this._city);
        // console.log("hood: ", this._hood);    
    };
    DataTableComponent.prototype.getToggle = function () {
        var _this = this;
        this.toggleService.change.subscribe(function (isOpen) {
            _this.isOpen = isOpen;
            // console.log('data-table toggle ',this.isOpen);
        });
    };
    // visible: boolean = false;
    // toggleBox(): void {
    //   this.visible = !this.visible;
    //   this.toggleService.setToggle(this.visible);
    // }
    DataTableComponent.prototype.changeToggle = function (val) {
        this.toggle = val;
    };
    DataTableComponent.prototype.ngOnInit = function () {
        this.getToggle();
        this.getValue();
        console.log(this.views);
    };
    __decorate([
        HostBinding('class.isOpen'),
        __metadata("design:type", Object)
    ], DataTableComponent.prototype, "isOpen", void 0);
    DataTableComponent = __decorate([
        Component({
            selector: 'app-data-table',
            templateUrl: './data-table.component.html',
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [ToggleService,
            NeighbourhoodService,
            DataTableService,
            HttpClient])
    ], DataTableComponent);
    return DataTableComponent;
}());
export { DataTableComponent };
//# sourceMappingURL=data-table.component.js.map