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
import { DataTable3Service } from '../../Service/data-table3.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
var View3DataTableComponent = /** @class */ (function () {
    function View3DataTableComponent(dataTable, neighbourhood, http) {
        this.dataTable = dataTable;
        this.neighbourhood = neighbourhood;
        this.http = http;
        this.displayedColumns = ['_id', 'sq_feet', 'AssessedValue', 'percSq_feet', 'AssessedValPerSqFeet', 'CR4'];
        this.dataSource = [];
        this.dupviewData = [];
        this.flag = true;
        this.dataSource = null;
    }
    View3DataTableComponent.prototype.getValue = function () {
        this._cityO = this.dataTable.sendCity();
        this._hoodO = this.dataTable.sendHood();
    };
    View3DataTableComponent.prototype.getUpdatedData = function () {
        var _this = this;
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        this.updatedData = this.dataTable.getView2()
            .subscribe(function (data) {
            _this.dataSource = [];
            _this.dataSource = data;
            // console.log("inside getUpdatedData with data:\n", this.dataSource);
        });
    };
    View3DataTableComponent.prototype.ngOnInit = function () {
        console.log("InIt");
        this.getValue();
        this.getUpdatedData();
    };
    View3DataTableComponent.prototype.ngAfterViewChecked = function () {
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        if (this._city !== this._cityO || this._hood !== this._hoodO) {
            this.ngOnInit();
        }
    };
    View3DataTableComponent.prototype.ngOnDestroy = function () {
        console.log("OnDestroy");
        this.updatedData.unsubscribe();
    };
    View3DataTableComponent = __decorate([
        Component({
            selector: 'app-view3-data-table',
            templateUrl: './view3-data-table.component.html',
            styleUrls: ['./view3-data-table.component.css']
        }),
        __metadata("design:paramtypes", [DataTable3Service, NeighbourhoodService, HttpClient])
    ], View3DataTableComponent);
    return View3DataTableComponent;
}());
export { View3DataTableComponent };
//# sourceMappingURL=view3-data-table.component.js.map