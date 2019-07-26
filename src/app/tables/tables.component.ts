import { Component, OnInit, ViewChild, Inject, EventEmitter, Output,Input } from '@angular/core';
import { CentralService } from '../Service/central.service';
import { ModalService } from '../Service/modal-service.service';
import { ModalComponent } from '../modal/modal.component';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
// import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

export class TablesComponent implements OnInit {
  view1Data: any;
  view2Data: any;
  view3Data: any;
  view4Data: any;
  concentrationData: any;
  @Output() change: EventEmitter<MatRadioChange>;
  @Input() checked: Boolean;
  private table1 : String = "show";
  private table2 : String = "hidden";
  private table3 : String = "hidden";
  private table4 : String = "hidden";
  private table5 : String = "hidden";
  constructor(
    private centralService: CentralService,
    private modalService : ModalService
  ) { }

  ngOnInit() {
    var viewDataFromTable = {
      modal:"first"};
    this.modalService.init(ModalComponent, {viewDataFromTable}, {});
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        //console.log(JSON.stringify(view));
      });
    this.centralService.view2Data
      .subscribe( view => {
        this.view2Data = view;
        // console.log("view3");
        // console.log(JSON.stringify(view));
      });
    this.centralService.view3Data
        .subscribe( view => {
          this.view3Data = view;
        });
    this.centralService.view4Data
      .subscribe( view => {
        this.view4Data = view;
      });
    this.centralService.concentrationData
      .subscribe( view => {
        this.concentrationData = view;
      });
  }

  changeView(e){
    this.centralService.currentView = e.value;
    if(e.value == 'view1'){
      this.table1 = "show";this.table2 = "hidden";this.table3 = "hidden";
      this.table4 = "hidden";this.table5="hidden";
    }else if(e.value == 'view2'){
      this.table1 = "hidden";this.table2 = "show";this.table3 = "hidden";
      this.table4 = "hidden";this.table5="hidden";
    }else if(e.value == 'view3'){
      this.table1 = "hidden";this.table2 = "hidden";this.table3 = "show";
      this.table4 = "hidden";this.table5="hidden";
    }else if(e.value == 'view4'){
      this.table1 = "hidden";this.table2 = "hidden";this.table3 = "hidden";
      this.table4 = "show";this.table5="hidden";
    }else if(e.value == 'concentration'){
      this.table1 = "hidden";this.table2 = "hidden";this.table3 = "hidden";
      this.table4 = "hidden";this.table5="show";
    }
  }
  changeFix(value, precision){
    value = Number(value);
    if(value == null || value === undefined){
      return value;
    }else{
      return value.toFixed(precision);
    }
  }
  initTableModal(){
    var viewDataFromTable = {
      modal:"tables",
      view1Data: this.view1Data,
      view2Data: this.view2Data,
      view3Data: this.view3Data,
      view4Data: this.view4Data,
      concentrationData: this.concentrationData};
    this.modalService.init(ModalComponent, {viewDataFromTable}, {});
  }
//------------------------------------------------------------------------
//All of the settings will be down here because they take up a lot of room
  view1settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
        title: 'Land Use',
        valuePrepareFunction: (value) => {if(value == null){return 'Null';}
                                          else{return value;}}
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      No_parcels: {
        title: '# Parcels'
      },
      percOfLand: {
        title: '% Land',
        valuePrepareFunction: (value) => { return this.changeFix(value*100,1)+ "%";}
      },
      percOfAssessedVal: {
        title: '% Value',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,2)+ "%";}
      },
      Scale: {
        title: 'Scale'
      }
      }
  };
  view2settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      _id:{
        title: 'Land Use',
        valuePrepareFunction: (value) => {if(value == null){return 'null';}
                                          else{return value;}}
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      No_Parcels: {
        title: '# Parcels'
      },
      No_Units: {
        title: '# Units'
      },
      AssessedValPerUnit: {
        title: 'Value/Unit',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      CR4: {
        title: 'CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1)+ "%";}
      }
    },
    pager : {
      perPage: 6
    }
  };
  view3settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      _id:{
        title: 'Land Use',
        valuePrepareFunction: (value) => {if(value == null){return 'null';}
                                          else{return value;}}
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      sq_feet: {
        title: 'Sq Feet'
      },
      percSq_feet: {
        title: '% Sq Feet',
        valuePrepareFunction: (value) => {return this.changeFix(value,1)+ "%";}
      },
      AssessedValPerSqFeet: {
        title: 'Total Value/Sq Foot',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      CR4: {
        title: 'CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1)+ "%";}
      }
    },
    pager : {
      perPage: 6
    }
  };
  view4settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      _id:{
        title: 'Land Use',
        valuePrepareFunction: (value) => {if(value == null){return 'null';}
                                          else{return value;}}
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      sq_feet: {
        title: 'Sq Feet'
      },
      percSq_feet: {
        title: '% Sq Feet',
        valuePrepareFunction: (value) => {return this.changeFix(value,1) + "%";}
      },
      AssessedValPerSqFeet: {
        title: 'Value/Sq Foot',
        valuePrepareFunction: (value) => {return this.changeFix(value,0);}
      },
      CR4: {
        title: 'CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1)+ "%";}
      }
    },
    pager : {
      perPage: 6
    }
  };
  view5settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      OwnerName:{
        title: 'Owner'
      },
      MarketCR4: {
        title: 'Market CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1) + "%";}
      },
      MarketShare: {
        title: 'MarketShare',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1) + "%";}
      },
      OwnerValue: {
        title: 'Owner Value'
      },
      landuse: {
        title: 'Land Use'
      }
    },
    pager : {
      perPage: 6
    }
  };
}
