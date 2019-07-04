  import { AppRoutingModule } from './app-routing.module';
import { GeojsonDataService } from './Service/geojson-data.service';
import { CitiesService } from './Service/cities.service';
import { GeometryService } from './Service/geometry.service';
import { NeighbourhoodService } from './Service/neighbourhood.service';
import { LocationService } from './Service/location.service';
import { ToggleService } from './Service/toggle.service';
import { DataTableService } from './Service/data-table.service';
import { DataTable2Service } from './Service/data-table2.service';
import { DataTable3Service } from './Service/data-table3.service';
import { DataTable4Service } from './Service/data-table4.service';
import { CentralService } from './Service/central.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
// angular material imports begin here
import { MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip'
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
import { DataTableComponent} from './data-table/data-table.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToggleableDirective } from './control-panel/toggleable.directive';
import { View1DataTableComponent } from './data-table/view1-data-table/view1-data-table.component';
import { View2DataTableComponent } from './data-table/view2-data-table/view2-data-table.component';
import { View3DataTableComponent } from './data-table/view3-data-table/view3-data-table.component';
import { View4DataTableComponent } from './data-table/view4-data-table/view4-data-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import { DataChartsComponent } from './data-charts/data-charts.component';
import { View1DataChartComponent } from './data-charts/view1-data-chart/view1-data-chart.component';
import { View2DataChartComponent } from './data-charts/view2-data-chart/view2-data-chart.component';
import { View3DataChartComponent } from './data-charts/view3-data-chart/view3-data-chart.component';
import { View4DataChartComponent } from './data-charts/view4-data-chart/view4-data-chart.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { ChartsComponent } from './charts/charts.component';
import { TablesComponent } from './tables/tables.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    ControlPanelComponent,
    NeighborhoodComponent,
    DataTableComponent,
    ToggleableDirective,
    View1DataTableComponent,
    View2DataTableComponent,
    View3DataTableComponent,
    View4DataTableComponent,
    DataChartsComponent,
    View1DataChartComponent,
    View2DataChartComponent,
    View3DataChartComponent,
    View4DataChartComponent,
    LeafletMapComponent,
    ChartsComponent,
    TablesComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDf4tl3dmehWlQPMVkud7Z1IjwbVTZATQU',
      libraries: ['places']
    }),
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    FlexLayoutModule,
    // NgbModule.forRoot()
    // Angular materials
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    ScrollingModule,
    MatTooltipModule,
    NgbModule,
    MatPaginatorModule,
    MatTabsModule,
    ChartsModule,
    Ng2SmartTableModule
  ],
  providers: [
    LocationService,
    CentralService,
    CitiesService,
    GeojsonDataService,
    NeighbourhoodService,
    ToggleService,
    DataTableService,
    DataTable2Service,
    DataTable3Service,
    DataTable3Service,
	GeometryService,
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
