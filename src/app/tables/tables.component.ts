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
  styleUrls: ['./tables.component.css']
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
  private table1 : String = "show";
  model = "lu";
  constructor(
    private centralService: CentralService,
    private cp: CurrencyPipe,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.view1Data = this.centralService.view1DataRaw;
    this.view2Data = this.centralService.view2DataRaw;
    this.view3Data = this.centralService.view3DataRaw;
    this.view4Data = this.centralService.view4DataRaw;
    this.concentrationData = this.centralService.concentrationDataRaw;
    this.landUseConcentrationData = this.centralService.landUseConcentrationDataRaw;
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
    this.centralService.landUseConcentrationData
      .subscribe( view => {
        this.landUseConcentrationData = view;
      });
  }

  changeFix(value, precision){
    value = Number(value);
    if(value == null || value === undefined){
      return value;
    }else{
      return value.toFixed(precision);
    }
  }

  print(content){
    console.log(content);
  }

  views: Views[] = [
    {value:'view1',viewValue:'View 1'},
    {value:'view2',viewValue:'View 2'},
    {value:'view3',viewValue:'View 3'},
    {value:'view4',viewValue:'View 4'},
    {value:'concentration',viewValue:'Owner Concentration'},
    {value:'landUseConcentrationData',viewValue:'Land Use Concentration'}
  ];
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
      perPage: 5
    }
  };
  view6settings = {
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
      perPage: 8
    }
  };
}
