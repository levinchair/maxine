var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
// import { ControlPanelComponent } from './control-panel/control-panel.component';
import { DataTableComponent } from './data-table/data-table.component';
var routes = [
    { path: '', component: AppComponent },
    // { path: 'showhood/:city', component: ControlPanelComponent},
    { path: 'showhood/:city', component: DataTableComponent },
    // { path: 'showhood/:city/:neighbourhood', component: DataTableComponent }
    { path: 'view1/:neighbourhood', component: DataTableComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map