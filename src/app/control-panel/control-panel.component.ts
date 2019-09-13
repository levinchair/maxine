import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CentralService } from '../Service/central.service';
import { Options } from 'ng5-slider';

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
   minValue: number = 25;
   maxValue: number = 75;
   options: Options = {
     floor: 0,
     ceil: 100
   };
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
  menuTooltips = {
    city:"You can select a city here, or draw your selection in the map below using the " +
     "<img src='../assets/icons-24px/png/025-search.png' height='20' width='20'> icon, or " +
     "<img src='../assets/icons-24px/png/025-search.png' height='20' width='20'> icon",
    neighborhood: "You can narrow to a pre-determined neighborhod here",
    landUse: "You can select a specific real property market or submarket here",
    filters: "Further filters can be found here",
    search: "Click here to search via address",
    go:"Click here to update results with new seearch criteria"
  }
}
