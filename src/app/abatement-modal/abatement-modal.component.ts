import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-abatement-modal',
  templateUrl: './abatement-modal.component.html',
  styleUrls: ['./abatement-modal.component.css']
})
export class AbatementModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
