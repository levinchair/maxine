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
import { DataTable4Service } from '../../Service/data-table4.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
var View4DataTableComponent = /** @class */ (function () {
    function View4DataTableComponent(dataTable, neighbourhood, http) {
        this.dataTable = dataTable;
        this.neighbourhood = neighbourhood;
        this.http = http;
        this.displayedColumns = ['_id', 'sq_feet', 'AssessedValue', 'percSq_feet', 'AssessedValPerSqFeet', 'CR4'];
        this.dataSource = [];
        this.dupviewData = [];
        this.flag = true;
        this.dataSource = null;
    }
    View4DataTableComponent.prototype.getValue = function () {
        this._cityO = this.dataTable.sendCity();
        this._hoodO = this.dataTable.sendHood();
    };
    View4DataTableComponent.prototype.getUpdatedData = function () {
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
    View4DataTableComponent.prototype.ngOnInit = function () {
        console.log("InIt");
        this.getValue();
        this.getUpdatedData();
    };
    View4DataTableComponent.prototype.ngAfterViewChecked = function () {
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        if (this._city !== this._cityO || this._hood !== this._hoodO) {
            this.ngOnInit();
        }
    };
    View4DataTableComponent.prototype.ngOnDestroy = function () {
        console.log("OnDestroy");
        this.updatedData.unsubscribe();
    };
    View4DataTableComponent = __decorate([
        Component({
            selector: 'app-view4-data-table',
            templateUrl: './view4-data-table.component.html',
            styleUrls: ['./view4-data-table.component.css']
        }),
        __metadata("design:paramtypes", [DataTable4Service, NeighbourhoodService, HttpClient])
    ], View4DataTableComponent);
    return View4DataTableComponent;
}());
export { View4DataTableComponent };
//# sourceMappingURL=view4-data-table.component.js.map