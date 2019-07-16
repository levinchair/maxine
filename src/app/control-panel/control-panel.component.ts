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
  selectedCity;
  private citiesSub: Subscription;

  onSelect(city: string) {
    this.selectedCity = city;
    this.centralService.setCity(city);
    this.centralService.getNeighbourhood();
  }

 ngOnInit() {
    this.citiesSub = this.centralService.getCities()
    .subscribe( (cities : string[]) => {
      this.cities = cities;
      //console.log(this.cities);
    });
  }
  ngAfterViewChecked() {

  }
}
