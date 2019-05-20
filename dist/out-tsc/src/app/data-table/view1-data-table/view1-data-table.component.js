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
import { DataTableService } from '../../Service/data-table.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { ToggleService } from '../../Service/toggle.service';
import { HttpClient } from '@angular/common/http';
var View1DataTableComponent = /** @class */ (function () {
    function View1DataTableComponent(dataTable, neighbourhood, http, toggleService) {
        this.dataTable = dataTable;
        this.neighbourhood = neighbourhood;
        this.http = http;
        this.toggleService = toggleService;
        this.displayedColumns = ['_id', 'percOfLand', 'No_parcels', 'Scale', 'AssessedValue', 'percOfAssessedVal'];
        this.dupviewData = [];
        this.v1 = false;
        this.flag = true;
        this.dataSource = [];
    }
    // visible: boolean = false;
    // toggleBox(): void {
    //   this.visible = !this.visible;
    //   this.toggleService.setToggle(this.visible);
    // }
    View1DataTableComponent.prototype.getValue = function () {
        this._cityO = this.dataTable.sendCity();
        this._hoodO = this.dataTable.sendHood();
        // console.log("selected city: ",this._city);
        // console.log("selected Hood: ", this._hood  );
    };
    View1DataTableComponent.prototype.getUpdatedData = function () {
        var _this = this;
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        this.updatedData = this.dataTable.getView1()
            .subscribe(function (data) {
            _this.dataSource = data;
        });
        this.dataSource.length = 0;
        // console.log("data: ",this.dataSource)
    };
    View1DataTableComponent.prototype.getToggle = function () {
        var _this = this;
        this.toggleService.change.subscribe(function (isOpen) {
            _this.v1 = !isOpen;
            console.log('data-table toggle ', _this.v1);
        });
    };
    View1DataTableComponent.prototype.ngOnInit = function () {
        // console.log("InIt");   
        this.getValue();
        this.getToggle();
        this.getUpdatedData();
    };
    View1DataTableComponent.prototype.ngAfterViewChecked = function () {
        this._city = this.dataTable.sendCity();
        this._hood = this.dataTable.sendHood();
        if (this._city !== this._cityO || this._hood !== this._hoodO) {
            this.ngOnInit();
        }
    };
    View1DataTableComponent.prototype.ngOnDestroy = function () {
        // console.log("OnDestroy");
        // this.dataSource=[];
        // this.updatedData.unsubscribe();
    };
    __decorate([
        HostBinding('class.v1'),
        __metadata("design:type", Object)
    ], View1DataTableComponent.prototype, "v1", void 0);
    View1DataTableComponent = __decorate([
        Component({
            selector: 'app-view1-data-table',
            templateUrl: './view1-data-table.component.html',
            styleUrls: ['./view1-data-table.component.css'],
            encapsulation: ViewEncapsulation.Emulated
        }),
        __metadata("design:paramtypes", [DataTableService, NeighbourhoodService, HttpClient, ToggleService])
    ], View1DataTableComponent);
    return View1DataTableComponent;
}());
export { View1DataTableComponent };
//# sourceMappingURL=view1-data-table.component.js.map