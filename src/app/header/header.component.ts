import { LocationService } from '../Service/location.service';
import { Component, OnInit, ElementRef, ViewChild, Input,Inject, NgZone, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CentralService } from '../Service/central.service';
import { ModalService } from '../Service/modal-service.service';
import { ModalComponent } from '../modal/modal.component';
import { MapsAPILoader } from '@agm/core';
import { Location } from '../../model/location.model';
declare const google: any;



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
  public searchControl: FormControl;
  public zoom = 5;
  public location: Location;
  public latitude = 41.4995;
  public longitude = -81.69541;
  @Input() public search;
  @ViewChild('matExpansionPanel') matExpansionPanelRef;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor( private mapsAPILoader: MapsAPILoader,
    private locationService: LocationService,
    private centralService: CentralService,
    private modalService : ModalService) { }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      //@ts-ignore
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        //@ts-ignore
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        this.search = place.formatted_address;

        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.zoom = 12;
        this.location = {latitude: this.latitude , longitude: this.longitude };
        // console.log('header.component.ts => ', this.search, this.location);
        this.locationService.addLocation(this.latitude, this.longitude);


        this.locationService.setHeader(this.search);
        if(this.search==null)
          this.locationService.setFlag(true);
        else
          this.locationService.setFlag(false);
      });
    });
 
    }
    updateAllData(){
      this.centralService.showSpinner.next(true);
      this.centralService.getGeometry();
      this.centralService.getViews(); // inital subscribe of the data
      //Closes dropdown menu if opened
      this.matExpansionPanelRef.close();
    }
    helpModal(){
      var viewDataFromTable = {
        modal:"first"};
      this.modalService.init(ModalComponent, {viewDataFromTable}, {});
    }
  }
