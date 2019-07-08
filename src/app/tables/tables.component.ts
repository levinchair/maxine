import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CentralService } from '../Service/central.service';
import { ModalService } from '../Service/modal-service.service';
import { ModalComponent } from '../modal/modal.component';

// import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

export class TablesComponent implements OnInit {
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

  constructor(
    private centralService: CentralService,
    private modalService : ModalService
  ) { }

  ngOnInit() {
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        //console.log(JSON.stringify(view));
      });
  }
  initTableModal(){
    let inputs = {
      currentView: this.currentView,
      viewData: this.view1Data
    }
    this.modalService.init(ModalComponent, inputs, {});
  }
}
