import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalService } from '../Service/modal-service.service';
import { CentralService } from '../Service/central.service';
import { DomService } from '../Service/dom-service.service';
import { Landing as landingSource } from './landingPage';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  viewData: any;
  settings: any;
  landingPageSource: landingSource;
  @ViewChild('display') display;
  @ViewChild('choice1') choice1;
  @ViewChild('choice2') choice2;
  @ViewChild('choice3') choice3;

  constructor(private modalService : ModalService,
              private centralService : CentralService,
              private domService: DomService,
              private cp: CurrencyPipe) { }

  ngOnInit() {
    //To access the instructions for the modal
    this.landingPageSource = new landingSource();
    //For when we want to display Tables modal
    if(this.domService.viewData.inputs.viewDataFromTable.modal == "tables"){
      this.settings = this.setSettings(this.centralService.currentView);
      this.viewData = this.domService.viewData.inputs.viewDataFromTable;
      this.viewData = this.setData(this.centralService.currentView);
      this.modalService.modalView = this.domService.viewData.inputs.viewDataFromTable.modal;
    }else if(this.domService.viewData.inputs.viewDataFromTable.modal == "first"){
      //make this an else if to use other modal views
      this.modalService.modalView = this.domService.viewData.inputs.viewDataFromTable.modal;
    }
  }
  setData(view){
    switch(view){
      case 'view1': return this.viewData.view1Data; break;
      case 'view2': return this.viewData.view2Data; break;
      case 'view3': return this.viewData.view3Data; break;
      case 'view4': return this.viewData.view4Data; break;
      case 'concentration': return this.viewData.concentrationData; break;
    }
  }
  setSettings(view){
    switch(view){
      case 'view1': return this.view1settings; break;
      case 'view2': return this.view2settings; break;
      case 'view3': return this.view3settings; break;
      case 'view4': return this.view4settings; break;
      case 'concentration': return this.view5settings; break;
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
  public close() {
    this.modalService.destroy();
  }
  choice(val){
    if(val == 1){
      this.choice1.nativeElement.className = "menu highlighted";
      this.choice2.nativeElement.className = "menu blank";
      this.choice3.nativeElement.className = "menu blank";
      this.display.nativeElement.innerHTML = this.landingPageSource.option1;
    }
    else if(val == 2){
      this.choice1.nativeElement.className = "menu blank";
      this.choice2.nativeElement.className = "menu highlighted";
      this.choice3.nativeElement.className = "menu blank";
      this.display.nativeElement.innerHTML = this.landingPageSource.option2;
    }else if(val == 3){
      this.choice1.nativeElement.className = "menu blank";
      this.choice2.nativeElement.className = "menu blank";
      this.choice3.nativeElement.className = "menu highlighted";
      this.display.nativeElement.innerHTML = this.landingPageSource.option3;
    }
  }


  ngAfterViewInit(){
    this.display.nativeElement.innerHTML = this.landingPageSource.option1;
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
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
        },
        No_Parcels: {
          title: '# Parcels'
        },
        No_Units: {
          title: '# Units'
        },
        AssessedValPerUnit: {
          title: 'Value/Unit',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
        },
        sq_feet: {
          title: 'Sq Feet',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","","1.0-0");}
        },
        percSq_feet: {
          title: '% Sq Feet',
          valuePrepareFunction: (value) => {return this.changeFix(value,1) + "%";}
        },
        AssessedValPerSqFeet: {
          title: 'Value/Sq Foot',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
          title: 'Owner Value',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
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
