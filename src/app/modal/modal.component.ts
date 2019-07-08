import { Component, OnInit } from '@angular/core';
import { ModalService } from '../Service/modal-service.service';
import { CentralService } from '../Service/central.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private modalService : ModalService,
              private centralService : CentralService) { }

  ngOnInit() {
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        //console.log(JSON.stringify(view));
      });
  }
  currentView = "View 1";
  view1Data: any;
  settings = {
    actions:false,
    columns: {
      cat:{
        title: 'Land Use'
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return value.toFixed(0)}
      },
      No_parcels: {
        title: '# Parcels'
      },
      percOfLand: {
        title: '% Land',
        valuePrepareFunction: (value) => {value= value*100; return value.toFixed(1)}
      },
      percOfAsseessedVal: {
        title: '% Value'
      },
      Scale: {
        title: 'Scale'
      }
      }
  };
  public close() {
    this.modalService.destroy();
  }
}
