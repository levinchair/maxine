import { Component, OnInit, Input } from '@angular/core';
import { NeighbourhoodService } from '../Service/neighbourhood.service';
import { Subscriber, Subscription } from 'rxjs';
import { CentralService } from '../Service/central.service';

@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.css']
})

export class NeighborhoodComponent implements OnInit {
private selectedCity;
private selectedHood;
onSelectFlag=false;
neighbourhood : string[];
_neighbourhood:string;
constructor(
  private centralService:CentralService) {
 }

onSelect(hood: string) {
    this.selectedHood=hood;
	  this.centralService.setHood(hood);
  }
  ngOnInit() {
    this.selectedCity = this.centralService.getCity();
	  //alert("selected city should be undefined" + this.selectedCity);
    this.centralService.getNeighbourhood(this.selectedCity)
    .subscribe( (neighborhood: string[]) =>{
      this.neighbourhood=neighborhood;
    } );

  }
  ngAfterContentInit() {

  }
}
