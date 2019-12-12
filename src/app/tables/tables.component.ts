import { Component, OnInit, ViewChild, Inject, EventEmitter, Output,Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CentralService } from '../Service/central.service';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { HostListener } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
export interface Views {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent implements OnInit {
  view1Data: any;
  view2Data: any;
  view3Data: any;
  view4Data: any;
  screenHeight:any;
  screenWidth:any;
  concentrationData: any;
  landUseConcentrationData: any;
  currentLandUse:String;
  displayLandUse:string;
  private table1 : String = "show";
  model = "lu";
  constructor(
    private centralService: CentralService,
    private cp: CurrencyPipe,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if(this.centralService.get_landUse() == undefined || this.centralService.get_landUse()=="All"){
      this.currentLandUse = "All";
      this.displayLandUse = "Land Use";
    }else{
      this.currentLandUse = this.centralService.get_landUse();
      this.displayLandUse = this.centralService.get_landUse();
    }
    //we need to do a deep copy as we are changing the data, see shallow vs deep copies
    //this is a gimmicky way to create a deep copy without external libraries/more code
    this.view1Data = JSON.parse(JSON.stringify(this.centralService.view1DataRaw));this.addTotal(this.view1Data,"view1");
    this.view2Data = JSON.parse(JSON.stringify(this.centralService.view2DataRaw));this.addTotal(this.view2Data,"view2");
    this.view3Data = JSON.parse(JSON.stringify(this.centralService.view3DataRaw));this.addTotal(this.view3Data,"view3");
    this.view4Data = JSON.parse(JSON.stringify(this.centralService.view4DataRaw));this.addTotal(this.view4Data,"view4");
    this.concentrationData = this.centralService.concentrationDataRaw;
    this.landUseConcentrationData = this.centralService.landUseConcentrationDataRaw;
  }

  changeFix(value, precision){
    value = Number(value);
    if(value == null || value === undefined){
      return value;
    }else{
      return value.toFixed(precision);
    }
  }

  addTotal(view, name){
    switch(name){
      case 'view2':{
        var totals = {};
        totals['cat'] = 'Total'; totals['No_Parcels'] = 0;
        totals['AssessedValue'] = 0; totals['No_Units'] = 0;
        totals['AssessedValPerUnit'] = 0;
        for(var el of view){
          totals['No_Parcels'] += el.No_Parcels;
          totals['AssessedValue'] += el.AssessedValue;
          totals['No_Units'] += el.No_Units;
          totals['AssessedValPerUnit'] += el.AssessedValPerUnit;
        }
        this.view2Data.push(totals);
        break;
      }
      case 'view3':{
        var totals = {};
        totals['cat'] = 'Total'; totals['sq_feet'] = 0;
        totals['AssessedValue'] = 0; totals['percSq_feet'] = 0;
        totals['AssessedValPerSqFeet'] = 0;
        for(var el of view){
          totals['sq_feet'] += el.sq_feet;
          totals['AssessedValue'] += el.AssessedValue;
          totals['percSq_feet'] += el.percSq_feet;
          totals['AssessedValPerSqFeet'] += el.AssessedValPerSqFeet;
        }
        this.view3Data.push(totals);
        break;
      }
      case 'view4':{
        var totals = {};
        totals['cat'] = 'Total'; totals['sq_feet'] = 0;
        totals['AssessedValue'] = 0; totals['percSq_feet'] = 0;
        totals['AssessedValPerSqFeet'] = 0;
        for(var el of view){
          totals['sq_feet'] += el.sq_feet;
          totals['AssessedValue'] += el.AssessedValue;
          totals['percSq_feet'] += el.percSq_feet;
          totals['AssessedValPerSqFeet'] += el.AssessedValPerSqFeet;
        }
        this.view4Data.push(totals);
        break;
      }
      default:{
        var totals = {};
        totals['cat'] = 'Total'; totals['No_parcels'] = 0;
        totals['AssessedValue'] = 0; totals['percOfLand'] = 0;
        totals['percOfAssessedVal'] = 0;
        for(var el of view){
          totals['No_parcels'] += el.No_parcels;
          totals['AssessedValue'] += el.AssessedValue;
          totals['percOfLand'] += el.percOfLand;
          totals['percOfAssessedVal'] += el.percOfAssessedVal;
        }
        this.view1Data.push(totals);
        break;
      }
    }
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
          title: '# Parcels',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","","1.0-0");}
        },
        percOfLand: {
          title: '% Land',
          valuePrepareFunction: (value) => { return this.changeFix(value*100,1)+ "%";}
        },
        percOfAssessedVal: {
          title: '% Value',
          valuePrepareFunction: (value) => {return this.changeFix(value*100,1)+ "%";}
        },
        Scale: {
          title: 'Scale',
          valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","","1.0-0");}
        }
      },
      pager : {
        perPage: 11
      }
  };
  view2settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
        title: 'Subcategory',
        valuePrepareFunction: (value) => {if(value == null){return 'null';}
                                          else{return value;}}
      },
      AssessedValue: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      },
      No_Parcels: {
        title: '# Parcels',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","","1.0-0");}

      },
      No_Units: {
        title: '# Units',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","","1.0-0");}

      },
      AssessedValPerUnit: {
        title: 'Value/Unit',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };
  view3settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
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
        valuePrepareFunction: (value) => {return this.changeFix(value,1)+ "%";}
      },
      AssessedValPerSqFeet: {
        title: 'Total Value/Sq Foot',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };
  view4settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
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
      }
    },
    pager : {
      perPage: 11
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
      perPage: 11
    }
  };
  view1CR4Settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      landuse: {
        title: 'Land Use'
      },
      MarketCR4: {
        title: 'Market CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1) + "%";}
      },
      landuseTot: {
        title: 'Total Value',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };

  view2CR4Settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
        title:'Subcategory'
      },
      CR4:{
        title: 'CR4',
        valuePrepareFunction: (value) => {if(value == 0){return null;}
                       else{return this.changeFix(value*100,1) + "%";}}
      },
      AssessedValue: {
        title:'Total Value',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };
  view3CR4Settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
        title:'Subcategory'
      },
      CR4:{
        title: 'CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1) + "%";}
      },
      AssessedValue: {
        title:'Total Value',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };

  view4CR4Settings = {
    actions:false,
    noDataMessage: "Choose a City and Neighborhood",
    columns: {
      cat:{
        title:'Subcategory'
      },
      CR4:{
        title: 'CR4',
        valuePrepareFunction: (value) => {return this.changeFix(value*100,1) + "%";}
      },
      AssessedValue: {
        title:'Total Value',
        valuePrepareFunction: (value) => {return this.cp.transform(value,"USD","symbol","1.0-0");}
      }
    },
    pager : {
      perPage: 11
    }
  };
}
