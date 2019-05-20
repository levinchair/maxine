var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Output, EventEmitter } from '@angular/core';
var ToggleService = /** @class */ (function () {
    function ToggleService() {
        // private toggler = new Subject<boolean>();
        // public $toggler = this.toggler.asObservable();
        this.isOpen = false;
        this.v1 = false;
        this.change = new EventEmitter();
        // setToggle(val: boolean){
        //   this.toggler.next(val);
        // }
    }
    ToggleService.prototype.toggle = function () {
        this.isOpen = !this.isOpen;
        this.change.emit(this.isOpen);
    };
    ToggleService.prototype.toggleView1 = function () {
        console.log("toggleView1 called....");
        this.v1 = !this.v1;
        this.change.emit(this.v1);
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], ToggleService.prototype, "change", void 0);
    ToggleService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], ToggleService);
    return ToggleService;
}());
export { ToggleService };
//# sourceMappingURL=toggle.service.js.map