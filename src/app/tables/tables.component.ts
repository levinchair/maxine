import { Component, OnInit, ViewChild } from '@angular/core';
import { CentralService } from '../Service/central.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

export class TablesComponent implements OnInit {

  view1Data: any;
  view1ColumnDisplay = ['AssessedValue','No_parcels','percOfLand','percOfAssessedVal','cat'];
  constructor(private centralService: CentralService) { }
  @ViewChild(MatSort) sort:MatSort;
  ngOnInit() {
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
      });
  }

  selectCategory(e){
    console.log(e);
  }
}
