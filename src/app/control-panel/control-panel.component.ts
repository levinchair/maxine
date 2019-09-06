import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CentralService } from '../Service/central.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ControlPanelComponent implements OnInit {

  constructor ( private centralService:CentralService ) { }

  cities : string[];
  cityFromService = this.centralService.getCity();
  selectedCity:string;
  selectedLandUse:string;
  public isCollapsed = true;
  private citiesSub: Subscription;
  private LANDUSE = ["Residential", "Commercial", "Government", "Industrial", "Institutional",
                    "Mixed", "Utility", "null", "All"];
  ngOnInit() {
     this.citiesSub = this.centralService.getCities()
     .subscribe( (cities : string[]) => {
       cities.splice(0,1);
       this.cities = cities;
       //console.log(this.cities);
     });
   }
  onSelect(city: string) {
    this.selectedCity = city;
    this.centralService.setCity(city);
    this.centralService.getNeighbourhood();
    this.centralService.setHood("All");
  }
  selectLandUse(landUse:string){
    this.selectedLandUse = landUse;
    this.centralService.setLandUse(landUse);
  }
  updateAllData(){
    this.centralService.showSpinner.next(true);
    this.centralService.getGeometry();
    this.centralService.getViews(); // inital subscribe of the data
  }

}
