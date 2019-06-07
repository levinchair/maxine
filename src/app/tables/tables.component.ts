import { Component, OnInit } from '@angular/core';
import { CentralService } from '../Service/central.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

export class TablesComponent implements OnInit {

  view1Data: any;
  view1TableData: any;

  constructor(private centralService: CentralService) { }

  ngOnInit() {
    this.centralService.view1Data
      .subscribe( view => {
        this.view1Data = view;
        this.updateTable1();
      });
  }

  updateTable1(){
    this.view1TableData = new MatTableDataSource<ParcelView1>(this.view1Data)
  }
}
export interface ParcelView1 {
    cat: string;
    AssessedValue: number;
    No_parcels: number;
    percOfLand: number;
    percOfAssessedVal: number;
}
