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
var DataTable2Service = /** @class */ (function () {
    function DataTable2Service(http) {
        this.http = http;
        this.dupviewData = [];
        this.updatedData1 = new Subject();
        this.updatedData2 = new Subject();
        this.viewData = [];
        this.dupviewData = [];
        // this._city=null;
        // this._neighborhood=null;  
    }
    DataTable2Service.prototype.setCity = function (city) {
        this._city = city;
        // console.log(this._city);
    };
    DataTable2Service.prototype.setHood = function (hood) {
        this._neighborhood = hood;
        // console.log(this._neighborhood);
    };
    DataTable2Service.prototype.sendCity = function () {
        // console.log(this._city);
        return this._city;
    };
    DataTable2Service.prototype.sendHood = function () {
        // console.log(this._neighborhood);
        return this._neighborhood;
    };
    DataTable2Service.prototype.getView2 = function () {
        var _this = this;
        this._city = this.sendCity();
        this._neighborhood = this.sendHood();
        console.log("city", this._city);
        console.log("hood", this._neighborhood);
        if (this._city != null && this._neighborhood != null) {
            this.http.get("http://localhost:3000/view2/" + this._city + "/" + this._neighborhood)
                .subscribe(function (view) {
                _this.viewData = view;
                console.log("viewData", _this.viewData);
                _this.dupviewData.length = 0;
                _this.viewData.forEach(function (v) {
                    // console.log("get v",v);
                    if (v._id != null && !_this.dupviewData.includes(v._id)) {
                        // console.log("put v",v)
                        _this.dupviewData.push(v);
                    }
                });
                console.log("DupviewData", _this.dupviewData);
                _this.dataSource = _this.dupviewData;
                _this.dataSource.sort(function (l, r) {
                    if (l._id < r._id)
                        return -1;
                    else if (l._id > r._id)
                        return 1;
                    else
                        return 0;
                });
                _this.updatedData2.next(_this.dataSource.slice());
            }, function () {
                _this.updatedData2.complete();
            });
        }
        else if (this._city != null && this._neighborhood == null) {
            this.http.get("http://localhost:3000/view2/" + this._city)
                .subscribe(function (view) {
                _this.viewData = view;
                console.log("viewData", _this.viewData);
                _this.dupviewData.length = 0;
                _this.viewData.forEach(function (v) {
                    // console.log("get v",v);
                    if (v._id != null && !_this.dupviewData.includes(v._id)) {
                        // console.log("put v",v)
                        _this.dupviewData.push(v);
                    }
                });
                console.log("DupviewData", _this.dupviewData);
                _this.dataSource = _this.dupviewData;
                _this.dataSource.sort(function (l, r) {
                    if (l._id < r._id)
                        return -1;
                    else if (l._id > r._id)
                        return 1;
                    else
                        return 0;
                });
                _this.updatedData2.next(_this.dataSource.slice());
            }, function () {
                _this.updatedData2.complete();
            });
        }
        this.setHood(null);
        return this.updatedData2.asObservable();
    };
    DataTable2Service = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], DataTable2Service);
    return DataTable2Service;
}());
export { DataTable2Service };
//# sourceMappingURL=data-table2.service.js.map