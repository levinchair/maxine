import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CitiesService } from '../Service/cities.service';
import { Subscription } from 'rxjs';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import { DataTableService } from '../Service/data-table.service';
import { DataTable2Service } from '../Service/data-table2.service';
import { DataTable3Service } from '../Service/data-table3.service';
import { DataTable4Service } from '../Service/data-table4.service';
import { LocationService } from '../Service/location.service';
import { GeometryService}  from '../Service/geometry.service';


@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ControlPanelComponent implements OnInit {

  constructor ( private cityService: CitiesService,
     private neighbourhoodService: NeighbourhoodService,
     private dataTableService: DataTableService,
     private dataTable2Service:DataTable2Service,
     private dataTable3Service:DataTable3Service,
     private dataTable4Service:DataTable4Service,
     private locationService:LocationService,
	 private geometryService:GeometryService) { }

  cities : string[];
  cityFromService = this.neighbourhoodService.getSelectedCity();
  selectedCity;
  private citiesSub: Subscription;

  onSelect(city: string) {
    this.selectedCity = city;
	//alert("Control Panel: " + this.selectedCity);
    this.neighbourhoodService.setSelectedcity(this.selectedCity);
    this.dataTableService.setCity(this.selectedCity);
    this.dataTable2Service.setCity(this.selectedCity);
    this.dataTable3Service.setCity(this.selectedCity);
    this.dataTable4Service.setCity(this.selectedCity);
    this.locationService.setCity(this.selectedCity);
    this.locationService.setFlag(true);
  	this.geometryService.setCity(this.selectedCity);
  }
  
 ngOnInit() {
    this.citiesSub = this.cityService.getCity()
    .subscribe( (cities : string[]) => {
      this.cities = cities;
      //console.log(this.cities);
    });
  }
  ngAfterViewChecked() {
      if(this.locationService.getFlag()==false)
          this.locationService.toggleFlag();
  }
}
