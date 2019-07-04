import { Component, OnInit, ViewChild } from '@angular/core';
import { CentralService } from '../Service/central.service';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

export class TablesComponent implements OnInit {
  view1Data: any;
  settings = {
    
    columns: {
      cat:{
        title: 'Land Use'
      },
      AssessedValue: {
        title: 'Total Value'
      },
      No_parcels: {
        title: '# Parcels'
      },
      percOfLand: {
        title: '% Land'
      },
      percOfAsseessedVal: {
        title: '% Value'
      }
    }
  };
  constructor(private centralService: CentralService) { }

  ngOnInit() {
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        console.log(JSON.stringify(view));
      });
  }

  selectCategory(e){
    console.log(e);
  }
}
