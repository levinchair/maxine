import { LocationService } from '../Service/location.service';
import { Component, OnInit,EventEmitter, ElementRef, ViewChild, Input, Output,Inject, NgZone, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CentralService } from '../Service/central.service';
import { Location } from '../../model/location.model';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
  @ViewChild('matExpansionPanel') matExpansionPanelRef;
  map: any;
  result: any;
  bounds:Array<Number> = [-84.81,38.38,-80.49,42.0];
  constructor( private centralService: CentralService) { }

  ngOnInit() {

    }
    test(){
      console.log("test");
    }
    searchEvent(e){
      let tempArr = [e.result.center[1],e.result.center[0]]
      this.centralService.setGeocoderData(tempArr);
    }
  }
