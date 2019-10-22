import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

//Models
import { SearchAddress } from 'src/model/search-address';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.css']
})
export class AddressSearchComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal ) {}
  areas: string[];
  model: SearchAddress;

  ngOnInit() {
    this.areas = ['half-mile radius', 'Neighborhood', 'City', 'County'];
    this.model = new SearchAddress('2121', 'Euclid Ave', this.areas[0], 'Cleveland', '44115' );
  }

  onSubmit(){
    //need to add the form to local data
    //get data to central service, the model is binded to the form.


    //this is option (have second modal)
    //this.modalService.open(AddressAreaComponent);

  }
  get testModel() { return JSON.stringify(this.model); }

}

//inner component Opened by the address Component 
@Component({
  selector: 'address-area',
  template: `
  <div class="modal-header">
      <h4 class="modal-title">Select Area Of Interest</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      Test. This is the inner component.
      <form (ngSubmit)="onSubmit()">
      <label for="interest">Area of Interest</label>
      <select required>
      <option *ngFor="let area of areas" [value]="area" class="from-control" id="interest">{{area}}</option>
      </select>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button> 
    </div>
  `
})
export class AddressAreaComponent {

  //put contants for types of areas of interest
  areas: String[];

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }
  
  
  ngOnInit(){
    this.areas = ['half-mile radius', 'Neighborhood', 'City', 'County'];
  }
  onSubmit(){
    //here we append the data from the area selected
  }

}
