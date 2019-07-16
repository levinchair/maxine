import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
// import { ControlPanelComponent } from './control-panel/control-panel.component';
// import { DataTableComponent } from './data-table/data-table.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  // // { path: 'showhood/:city', component: ControlPanelComponent},
  // { path: 'showhood/:city', component: DataTableComponent},
  // // { path: 'showhood/:city/:neighbourhood', component: DataTableComponent }
  // { path: 'view1/:neighbourhood', component: DataTableComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
