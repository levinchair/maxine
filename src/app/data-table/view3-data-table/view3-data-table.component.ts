import { Component, OnInit } from '@angular/core';
import { DataTable3Service } from '../../Service/data-table3.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
import { view3 } from '../../../model/view3.model';
import { Subject, Observable, Subscription, Subscriber } from 'rxjs';
@Component({
  selector: 'app-view3-data-table',
  templateUrl: './view3-data-table.component.html',
  styleUrls: ['./view3-data-table.component.css']
})
export class View3DataTableComponent implements OnInit {

  private displayedColumns: string[] = [ '_id', 'sq_feet', 'AssessedValue','percSq_feet', 'AssessedValPerSqFeet', 'CR4'];
  private dataSource: view3[] = [];
  _city;
  _hood;
  _cityO;
  _hoodO;
  flag :boolean;
  viewData :view3[];
  dupviewData = [];
  private vData : view3[];
  private updatedData: Subscription;
  constructor(private dataTable: DataTable3Service, private neighbourhood: NeighbourhoodService,private http:HttpClient ) { 
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
    .subscribe((data:view3[])=>{
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



