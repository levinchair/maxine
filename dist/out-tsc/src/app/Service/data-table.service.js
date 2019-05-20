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
var DataTableService = /** @class */ (function () {
    function DataTableService(http) {
        this.http = http;
        this.dupviewData = [];
        this.updatedData1 = new Subject();
        this.updatedData2 = new Subject();
        this.viewData = [];
        this.dupviewData = [];
    }
    DataTableService.prototype.setCity = function (city) {
        this._city = city;
        // console.log(this._city);
    };
    DataTableService.prototype.setHood = function (hood) {
        this._neighborhood = hood;
        // console.log(this._neighborhood);
    };
    DataTableService.prototype.sendCity = function () {
        // console.log(this._city);
        return this._city;
    };
    DataTableService.prototype.sendHood = function () {
        // console.log(this._neighborhood);
        return this._neighborhood;
    };
    // sendXVview1() {
    //   return this.xIDChart.asObservable();
    // }
    // view1 methods: getView1() and getUpdatedData1()
    DataTableService.prototype.getView1 = function () {
        var _this = this;
        this._city = this.sendCity();
        this._neighborhood = this.sendHood();
        console.log("city", this._city);
        console.log("hood", this._neighborhood);
        if (this._city != null && this._neighborhood != null) {
            this.http.get("http://localhost:3000/view1/" + this._city + "/" + this._neighborhood)
                .subscribe(function (view) {
                _this.dupviewData.length = 0;
                _this.viewData = view;
                _this.viewData.forEach(function (v) {
                    if (v._id.cat != null && !_this.dupviewData.includes(v._id.cat)) {
                        _this.dupviewData.push(v);
                    }
                });
                _this.dataSource = _this.dupviewData;
                console.log(_this.dataSource);
                //this.dupviewData.length=0;
                _this.dataSource.sort(function (l, r) {
                    if (l._id.cat < r._id.cat)
                        return -1;
                    else if (l._id.cat > r._id.cat)
                        return 1;
                    else
                        return 0;
                });
                _this.updatedData1.next(_this.dataSource.slice());
                // this.dataSource1=this.viewData;
                // this.dataSource1.sort((l,r)=>{
                //   if(l._id.cat <r._id.cat )
                //       return -1;
                //   else if (l._id.cat >r._id.cat )
                //       return 1;
                //   else
                //       return 0;
                // })
                // // taking ID and perOfLand for charts here:
                // this.xIDChart = this.dataSource1.map((d)=> { return d._id.cat});
                // this.yLandChart = this.dataSource1.map((d)=> { return d.percOfLand});
                // this.xIDChart = this.xIDChart.slice(1);
                // this.yLandChart = this.yLandChart.slice(1);
                // console.log(this.xIDChart, this.yLandChart); 
            }, function () {
                _this.updatedData1.complete();
            });
            // return this.updatedData1.asObservable();
        }
        else if (this._city != null && this._neighborhood == null) {
            this.http.get("http://localhost:3000/view1/" + this._city)
                .subscribe(function (view) {
                _this.dupviewData.length = 0;
                _this.viewData = view;
                _this.viewData.forEach(function (v) {
                    if (v._id.cat != null && !_this.dupviewData.includes(v._id.cat)) {
                        _this.dupviewData.push(v);
                    }
                });
                _this.dataSource = _this.dupviewData;
                console.log(_this.dataSource);
                //this.dupviewData.length=0;
                _this.dataSource.sort(function (l, r) {
                    if (l._id.cat < r._id.cat)
                        return -1;
                    else if (l._id.cat > r._id.cat)
                        return 1;
                    else
                        return 0;
                });
                _this.updatedData1.next(_this.dataSource.slice());
                // this.dataSource1=this.viewData;
                // this.dataSource1.sort((l,r)=>{
                //   if(l._id.cat <r._id.cat )
                //       return -1;
                //   else if (l._id.cat >r._id.cat )
                //       return 1;
                //   else
                //       return 0;
                // })
                // // taking ID and perOfLand for charts here:
                // this.xIDChart = this.dataSource1.map((d)=> { return d._id.cat});
                // this.yLandChart = this.dataSource1.map((d)=> { return d.percOfLand});
                // this.xIDChart = this.xIDChart.slice(1);
                // this.yLandChart = this.yLandChart.slice(1);
                // console.log(this.xIDChart, this.yLandChart); 
            }, function () {
                _this.updatedData1.complete();
            });
        }
        this.setHood(null);
        return this.updatedData1.asObservable();
    };
    // getUpdatedData1(){
    //   return this.updatedData1.asObservable();
    // }
    DataTableService.prototype.getView1Chart = function () {
        // slicing from 1 as 0 index is showing null ! need to fix this but can be seen later
        // TODO ---------------------------------------------------------------------------------------Heta
        /* From Heta:
        Neha, I was lately working on this function. The scene is the function isnt reached out. The reason
        is entire service is working only via observables, but this function is static. I am confused how to
        call this.xIDChart and this.yLandChart as an observable!
        */
        // this.xIDChart = this.xIDChart.slice(1);
        // this.yLandChart = this.yLandChart.slice(1);
        console.log(this.xIDChart, this.yLandChart);
    };
    DataTableService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], DataTableService);
    return DataTableService;
}());
export { DataTableService };
//# sourceMappingURL=data-table.service.js.map