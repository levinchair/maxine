  import { AppRoutingModule } from './app-routing.module';
import { GeojsonDataService } from './Service/geojson-data.service';
import { CitiesService } from './Service/cities.service';
import { GeometryService } from './Service/geometry.service';
import { NeighbourhoodService } from './Service/neighbourhood.service';
import { LocationService } from './Service/location.service';
import { ToggleService } from './Service/toggle.service';
import { CentralService } from './Service/central.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ModalService } from './Service/modal-service.service';
import { DomService } from './Service/dom-service.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {CurrencyPipe} from '@angular/common';
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
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToggleableDirective } from './control-panel/toggleable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { ChartsComponent } from './charts/charts.component';
import { TablesComponent } from './tables/tables.component';
import { ModalComponent } from './modal/modal.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    ControlPanelComponent,
    NeighborhoodComponent,
    ToggleableDirective,
    LeafletMapComponent,
    ChartsComponent,
    TablesComponent,
    ModalComponent
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
    Ng2SmartTableModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule
  ],
  providers: [
    LocationService,
    CentralService,
    CitiesService,
    GeojsonDataService,
    NeighbourhoodService,
    ToggleService,
	  GeometryService,
    GoogleMapsAPIWrapper,
    ModalService,
    DomService,
    CurrencyPipe
  ],
  entryComponents:[
    ModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
