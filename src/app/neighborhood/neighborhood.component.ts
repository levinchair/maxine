import { Component, OnInit, Input } from '@angular/core';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import {Subscriber, Subscription} from 'rxjs';
import { DataTableService } from '../Service/data-table.service';
import { DataTable2Service } from '../Service/data-table2.service';
import { DataTable3Service } from '../Service/data-table3.service';
import { DataTable4Service } from '../Service/data-table4.service';
import {LocationService} from '../Service/location.service';
import {GeometryService} from '../Service/geometry.service';

@Component({
  selector: 'app-neighborhood',
  template: `  
  <ul>
    <li *ngFor= "let hood of neighbourhood"
    (click)="onSelect(hood)">      
    <a routerLink="/view1/{{city}}/{{hood}}">{{hood | uppercase}} </a> 
    </li>
  </ul> 
   `,
  styleUrls: ['./neighborhood.component.css']
})

export class NeighborhoodComponent implements OnInit {
private selectedCity;
private selectedHood;
onSelectFlag=false;
neighbourhood=[];
_neighbourhood:string;
constructor( 
  private neighbourhoodService: NeighbourhoodService, 
  private dataTableService: DataTableService, 
  private dataTable2Service:DataTable2Service,
  private dataTable3Service:DataTable3Service, 
  private dataTable4Service:DataTable4Service,
  private locationService:LocationService,
  private geometryService:GeometryService) {
 }
  
onSelect(hood: string) {
    this.neighbourhoodService.setOnselectFlag(true);
    this.selectedCity = this.neighbourhoodService.getSelectedCity();
    this._neighbourhood = hood;
    //alert( "neighborhood.component.ts  " +this._neighbourhood +"-->"+ this.selectedCity);
    this.neighbourhoodService.setSelectedHood(this._neighbourhood);
    this.locationService.setFlag(true);
    this.locationService.getLocation();
	
	// moved this here because this was being set every time a new lifecycle was intitated
    this.dataTableService.setHood(this._neighbourhood);
    this.dataTable2Service.setHood(this._neighbourhood);
    this.dataTable3Service.setHood(this._neighbourhood);
    this.dataTable4Service.setHood(this._neighbourhood);
    this.locationService.setHood(this._neighbourhood);
	this.geometryService.setHood(this._neighbourhood);
  }
  ngOnInit() {
    this.selectedCity = this.neighbourhoodService.getSelectedCity();
	//alert("selected city should be undefined" + this.selectedCity);
    this.neighbourhoodService.getNeighbourhood(this.selectedCity)
    .subscribe( (neighborhood :string[])=>{
      this.neighbourhood=neighborhood;
    } );
   
    this.neighbourhoodService.setOnselectFlag(false);
  }
  ngAfterContentInit() {
    //alert("i am in neighborhood")
    if(!this.locationService.getFlag())
      this.locationService.toggleFlag();
    //console.log("flag:",this.locationService.getFlag());
    //alert("hood:" + this._neighbourhood)
    this.dataTableService.setCity(this.selectedCity);
    this.dataTable2Service.setCity(this.selectedCity);
    this.dataTable3Service.setCity(this.selectedCity);
    this.dataTable4Service.setCity(this.selectedCity);
    this.locationService.setCity(this.selectedCity);
	


  }
}