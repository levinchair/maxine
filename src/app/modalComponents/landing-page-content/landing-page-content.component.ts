import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CentralService } from '../../Service/central.service';

@Component({
  selector: 'app-landing-page-content',
  templateUrl: './landing-page-content.component.html',
  styleUrls: ['./landing-page-content.component.css']
})
export class LandingPageContentComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              private centralService: CentralService) { }

  ngOnInit() {
  }
  propertyMarket(){
    this.centralService.firstVisit = true;
    this.activeModal.dismiss('A');
  }
  laborMarket(){
    // when implemented will send which button was pressed to control panel
    // this.activeModal.dismiss('B');
  }
  addressSearch(){
    // when implemented will send which button was pressed to control panel
    this.activeModal.dismiss('C');
  }
}
