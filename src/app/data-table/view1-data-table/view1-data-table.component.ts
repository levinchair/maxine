import { Component, OnInit, ViewEncapsulation, AfterViewChecked,HostBinding, ViewChild} from '@angular/core';
import { DataTableService } from '../../Service/data-table.service';
import { NeighbourhoodService } from 'src/app/Service/neighbourhood.service';
import { ToggleService } from '../../Service/toggle.service';
import { HttpClient } from '@angular/common/http';
import { view1 } from '../../../model/view1.model';
import { Subscription, Observable } from 'rxjs';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-view1-data-table',
  templateUrl: './view1-data-table.component.html',
  styleUrls: ['./view1-data-table.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class View1DataTableComponent implements OnInit{
  _city;
  _hood;
  _cityO;
  _hoodO;
  lengthO;
  lengthN;
  dataSource;
  flag :boolean;
  viewData :view1[];
  showMenu: boolean;
  dupviewData = [];
  private vData : view1[];
  private updatedData: Subscription;
  private displayedColumns: string[] = [ '_id', 'percOfLand', 'No_parcels', 'Scale', 'AssessedValue', 'percOfAssessedVal'];
 
  constructor(private dataTable: DataTableService, private neighbourhood: NeighbourhoodService,private http:HttpClient,private toggleService:ToggleService ) { 
    this.flag=true;
     this.dataSource= [];
    
  }
  getValue(){
    this._cityO=this.dataTable.sendCity();
    this._hoodO=this.dataTable.sendHood();
  } 
  getUpdatedData(){
    this._city=this.dataTable.sendCity();
    this._hood=this.dataTable.sendHood();
    this.updatedData=this.dataTable.getView1().subscribe((data:view1[]) => this.dataSource=data );   
    this.dataTable.setData(this.updatedData);
    this.dataSource.length=0;
  }
  
  toggleMenu() {
    this.showMenu = this.showMenu;
    this.toggleService.changeViewOneTable.emit(this.showMenu);
  }

  ngOnInit() {
    this.getValue(); 
    this.toggleMenu();
    this.getUpdatedData();    
  } 
}