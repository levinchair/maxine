import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.css']
})
export class AddressSearchComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  openSecondModal(){
    this.modalService.open(AddressAreaComponent);
  }

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
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button> 
    </div>
  `
})
export class AddressAreaComponent {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

}
