import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CentralService } from '../Service/central.service';
import { Options } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LandingPageContentComponent } from '../landing-page-content/landing-page-content.component';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import '../Service/SearchOptions.model';

//Will populate with owners when a neighborhood is searched.
var ownersList = ["Peter","Dakotah Pettry","Joe","Bob"];

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ControlPanelComponent implements OnInit {

  constructor ( private centralService:CentralService,
                private modalService: NgbModal ) { }

  cities : string[];
  cityFromService = this.centralService.getCity();
  selectedCity : string;
  selectedLandUse : string;
  abatementList = [];
  public isCollapsed = true;
  private citiesSub: Subscription;
  private LANDUSE = ["Residential", "Commercial", "Government", "Industrial", "Institutional",
                    "Mixed", "Utility", "null", "All"];
   acresMinValue: number = 0; acresMaxValue: number = 100;
   valueMinValue: number = 0; valueMaxValue: number = 100;
   ownerInput : String;
   acresOptions: Options = {
     floor: 0,
     ceil: 100
   };
   valueOptions: Options = {
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
     //populates abatementList w/ 1-26
     for(let i = 1; i < 27; i++){
       this.abatementList.push(i);
     }
     this.open();
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
    this.centralService.setParcelArray([]);
    this.setOptions();
    this.centralService.getGeometry();
    this.centralService.getViews(); // inital subscribe of the data
  }
  setOptions(){
    //Check if acres was changed from default
    if(this.acresMinValue != this.acresOptions.floor
        || this.acresMaxValue != this.acresOptions.ceil){
      this.centralService.options.acres = [this.acresMinValue,this.acresMaxValue];
    }//Check if value was changed from default
    if(this.valueMinValue != this.valueOptions.floor
        || this.valueMaxValue != this.valueOptions.ceil){
      this.centralService.options.value = [this.valueMinValue,this.valueMaxValue];
    }//Check if any abatements were selected
    // if(this.abatementList.length > 0){
    //   this.centralService.options.abatement = this.abatementList[0];//NEED TO FIX / CLARIFY
    // }//Check if any owner was selected, empty strings in js are falsey
    if(this.ownerInput){
      this.centralService.options.owner = this.ownerInput;
    }//Check if a land use was selected and assign
    if(this.selectedLandUse){
      this.centralService.options.sitecat1 = this.selectedLandUse;
    }
    console.log(this.centralService.options);
  }
  open(){
    const modalRef = this.modalService.open(LandingPageContentComponent,{ centered: true, size: 'lg'});
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : ownersList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
