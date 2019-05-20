import { Component, OnInit } from '@angular/core';
import { DataTable4Service } from '../../Service/data-table4.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
import { view4 } from '../../../model/view4.model';
import { Subject, Observable, Subscription, Subscriber } from 'rxjs';

@Component({
  selector: 'app-view4-data-table',
  templateUrl: './view4-data-table.component.html',
  styleUrls: ['./view4-data-table.component.css']
})
export class View4DataTableComponent implements OnInit {

  private displayedColumns: string[] = [ '_id', 'sq_feet', 'AssessedValue','percSq_feet', 'AssessedValPerSqFeet', 'CR4'];
  private dataSource: view4[] = [];
  _city;
  _hood;
  _cityO;
  _hoodO;
  flag :boolean;
  viewData :view4[];
  dupviewData = [];
  private vData : view4[];
  private updatedData: Subscription;
  constructor(private dataTable: DataTable4Service, private neighbourhood: NeighbourhoodService, private http:HttpClient ) { 
    this.flag=true;
    this.dataSource= null;
  }

  getValue(){
    
    this._cityO=this.dataTable.sendCity();
    this._hoodO=this.dataTable.sendHood();
  } 
  getUpdatedData() {
    this._city=this.dataTable.sendCity();
    this._hood=this.dataTable.sendHood();
    this.updatedData=this.dataTable.getView2()
    .subscribe((data:view4[])=>{
      this.dataSource= [];
      this.dataSource=data;
    });
  }
  ngOnInit() {
    console.log("InIt");   
    this.getValue();
    this.getUpdatedData();
  } 
}
