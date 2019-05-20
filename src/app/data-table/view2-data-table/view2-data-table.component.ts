import { Component, OnInit, OnChanges } from '@angular/core';
import { DataTable2Service } from '../../Service/data-table2.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { HttpClient } from '@angular/common/http';
import { view2 } from '../../../model/view2.model';
import { Subject, Observable, Subscription, Subscriber } from 'rxjs';
@Component({
  selector: 'app-view2-data-table',
  templateUrl: './view2-data-table.component.html',
  styleUrls: ['./view2-data-table.component.css']
})
export class View2DataTableComponent {
  private displayedColumns: string[] = [ '_id', 'No_Units', 'No_Parcels', 'AssessedValue', 'AssessedValPerUnit', 'CR4'];
  private dataSource: view2[] = [];
  _city;
  _hood;
  _cityO;
  _hoodO;
  flag :boolean;
  viewData :view2[];
  dupviewData = [];
  private vData : view2[];
  private updatedData: Subscription;
  constructor(private dataTable: DataTable2Service, private neighbourhood: NeighbourhoodService,private http:HttpClient ) { 
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
    this.updatedData=this.dataTable.getView2(this._city,this._hood)
    .subscribe((data:view2[])=>{
      this.dataSource= [];
      this.dataSource=data;
    });
  }
  ngAfterViewInit()
  {
    this.getUpdatedData();
  }
}