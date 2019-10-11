import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CentralService } from '../Service/central.service';
import { Options, LabelType } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LandingPageContentComponent } from '../landing-page-content/landing-page-content.component';
import { debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import '../Service/SearchOptions.model';
import { CurrencyPipe } from '@angular/common';
import { AbatementModalComponent } from '../abatement-modal/abatement-modal.component';
import { DTLUModalComponent } from '../dtlu-modal/dtlu-modal.component';

//Will populate with owners when a neighborhood is searched.

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ControlPanelComponent implements OnInit {

  constructor ( private centralService:CentralService,
                public cp: CurrencyPipe,
                private modalService: NgbModal ) { }

  cities : string[];
  cityFromService = this.centralService.getCity();
  selectedCity : string;
  selectedLandUse : string;
  sitecat2Selected: boolean = true;
  abatementList = [];
  neighborhood : string[] = [];
  selectedHood:string = "";
  public isCollapsed = true;
  private citiesSub: Subscription;
  private LANDUSE = ["Residential", "Commercial", "Government", "Industrial", "Institutional",
                    "Mixed", "Utility", "null", "All"];
   acresMinValue: number = 0; acresMaxValue: number = 5;
   valueMinValue: number = 0; valueMaxValue: number = 10;
   unitsMinValue: number = 0; unitsMaxValue: number = 10;
   ownerInput : String;
   ownerInputList : String[] = [];
   ownerList = ["Sample Owner List","Example"];
   ownerMessage: String = "";
   acresOptions: Options = {
     floor: 0,
     ceil: 5
   };
   valueOptions: Options = {
     floor: 0,
     ceil: 10
   };
   unitsOptions: Options = {
     floor: 0,
     ceil: 10
   };

  ngOnInit() {
     this.citiesSub = this.centralService.getCities()
      .subscribe( (cities : string[]) => {
       cities.splice(0,1);
       this.cities = cities;
       //console.log(this.cities);
     });
     this.centralService.filterOwnerData.subscribe( (view) => {
         this.ownerList = view;
       }
     )
     this.centralService.neighborhoods.subscribe( (hoods) => {
         this.neighborhood = hoods;
         //console.log(JSON.stringify(view));
       });
     this.centralService.filterMaxData.subscribe( (data) => {
        this.setMax(data);
     });
     //populates abatementList w/ 1-26
     for(let i = 1; i < 27; i++){
       this.abatementList.push(i);
     }
     //Opens landing page
     this.open();
   }

  onSelect(city: string) {
    this.selectedCity = city;
    this.centralService.setCity(city);
    this.centralService.getNeighbourhood();
    this.ownerList = []; this.ownerMessage = "";
    if(this.cityAll.includes(city)){
      this.onSelectHood('All');
      this.centralService.getFilterOwnerData();
      this.centralService.getFilterMaxData();
    }else{
      this.selectedHood = "Select Neighborhood...";
    }
    this.resetFilter();
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
    if(this.unitsMinValue != this.unitsOptions.floor
        || this.unitsMaxValue != this.unitsOptions.ceil){
      this.centralService.options.scale_units = [this.unitsMinValue,this.unitsMaxValue];
    }//Check if value was changed from default
    console.log(this.centralService.options);
  }

  open(){
    const modalRef = this.modalService.open(LandingPageContentComponent,{ centered: true, size: 'lg'});
  }

  onSelectHood(hood: string) {
      this.selectedHood=hood;
  	  this.centralService.setHood(hood);
      this.centralService.getFilterOwnerData();
      this.centralService.getFilterMaxData();
      this.resetFilter();
    }

  setMax(data){
    //Because of the way events work in angular you have to create a new Options
    //object each time you want to change the slider options
    var maxAcre = 5; var maxValue = 10; var maxScale = 10;
    for(var i = 0; i < data.length; i++){
      if(Math.ceil(data[i].maxAcre) > maxAcre){
        maxAcre = data[i].maxAcre;
      }if(Math.ceil(data[i].maxValue) > maxValue){
        maxValue = data[i].maxValue;
      }if(Math.ceil(data[i].maxScale) > maxScale){
        maxScale = data[i].maxScale;
      }
    }
    //Create new options objects to assign for each slider
    const newOptions: Options = Object.assign({}, this.acresOptions);
    newOptions.ceil = maxAcre; newOptions.floor = 0; this.acresMaxValue = maxAcre;
    //Setting tick values
    newOptions.showTicksValues = true;
    newOptions.stepsArray = [
      {value:0},{value:0.1},{value:0.2},{value:0.3},{value:0.4},{value:0.5},
      {value:1},{value:2},{value:3},{value:4},{value:5},{value:Math.ceil(maxAcre)}
    ];
    this.acresOptions = newOptions;
    //Create new options objects to assign for each slider
    const new2Options: Options = Object.assign({}, this.valueOptions);
    new2Options.ceil = maxValue; new2Options.floor = 0; this.valueMaxValue = maxValue;
    //Gives value Dollar signs
    new2Options.translate = (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return this.cp.transform(value,"USD","symbol","1.0-0");
        case LabelType.High:
          return this.cp.transform(value,"USD","symbol","1.0-0");
        default:
          return this.cp.transform(value,"USD","symbol","1.0-0");
      }
    }
    this.valueOptions = new2Options;
    //Create new options objects to assign for each slider
    const new3Options: Options = Object.assign({}, this.unitsOptions);
    new3Options.ceil = maxScale; new3Options.floor = 0; this.unitsMaxValue = maxScale;
    //Gives value , seperation signs 1000 -> 1,000
    new3Options.translate = (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return this.cp.transform(value,"USD","","1.0-0");
        case LabelType.High:
          return this.cp.transform(value,"USD","","1.0-0");
        default:
          return this.cp.transform(value,"USD","","1.0-0");
      }
    }
    this.unitsOptions = new3Options;
  }

  resetFilter(){
    // Reset Sliders
    this.acresMaxValue = this.acresOptions.ceil; this.acresMinValue = this.acresOptions.floor;
    this.valueMaxValue = this.valueOptions.ceil; this.valueMinValue = this.valueOptions.floor;
    this.unitsMaxValue = this.unitsOptions.ceil; this.unitsMinValue = this.unitsOptions.floor;
    // TODO: Reset Abatements
    // Reset Owner
    this.ownerInputList = [];
    this.ownerInput = "";
  }

  addOwner(owner){
    if(owner != "" && owner != null && owner !== undefined){
      if(this.ownerInputList.indexOf(owner.toUpperCase().trim()) >= 0){
        //owner is already in list, alert user and reset ownerInput
        this.ownerMessage = "Repeat Entry"
        this.ownerInput = "";
      }else{
        //owner is not in list, add as uppercased and trim excess whitespace
        this.ownerInputList.push(owner.toUpperCase().trim());
        this.ownerInputList.sort();
        this.ownerMessage = "";
        this.ownerInput = "";
      }
    }
  }

  removeOwner(owner){
    //find Index of owener
    let index = this.ownerInputList.indexOf(owner);
    if(index >= 0){
      //remove string at index
      this.ownerInputList.splice(index,1);
      //Sort in alphabetical
      this.ownerInputList.sort();
      this.ownerMessage = "";
    }else{console.log("Error:removeOwner owner not found");}
  }

  openAbatementModal(){
    const modalRef = this.modalService.open(AbatementModalComponent,{ centered: true, size: 'lg'});
  }
  openDTLUModal(){
    const modalRef = this.modalService.open(DTLUModalComponent,{ centered: true, size: 'lg'});
  }
  //observable object for filter's owners input
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.ownerList.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
    //used to get filters for city's with no neighborhoods
    cityAll = [
              "BAY VILLAGE","BEACHWOOD","BEDFORD","BEDFORD HEIGHTS",
              "BENTLEYVILLE","BEREA","BRECKSVILLE","BROADVIEW HEIGHTS",
              "CHAGRIN FALLS","GATES MILLS","GLENWILLOW","HIGHLAND HEIGHTS",
              "HIGHLAND HILLS","HUNTING VALLEY","INDEPENDENCE","LINNDALE",
              "LYNDHURST","MAPLE HEIGHTS","MAYFIELD","MAYFIELD HEIGHTS",
              "MORLAND HILLS","NEWBURGH HEIGHTS","NORTH OLMSTED","NORTH RANDALL",
              "NORTH ROYALTON","OAKWOOD","OLMSTED FALLS","OLMSTED TOWNSHIP",
              "ORANGE","PARMA","PARMA HEIGHTS","PEPPER PIKE","RICHMOND HEIGHTS",
              "ROCKY RIVER","SEVEN HILLS","SOLON","STRONGSVILLE","UNIVERSITY HEIGHTS",
              "VALLEY VIEW","WALTON HILLS","WESTLAKE","WOODMERE"
             ];
}
