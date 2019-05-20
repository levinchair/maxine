import { Component, ViewEncapsulation, OnInit, HostBinding, Directive, Input, TemplateRef, NgModule, ViewChild } from '@angular/core';
import { ToggleService } from '../Service/toggle.service';
import { DataTableService } from 'src/app/Service/data-table.service';
import { view1 } from '../../model/view1.model';
import { Subject } from 'rxjs';
import {View2DataTableComponent} from '../data-table/view2-data-table/view2-data-table.component'
import {View1DataTableComponent} from '../data-table/view1-data-table/view1-data-table.component'
import {View3DataTableComponent} from '../data-table/view3-data-table/view3-data-table.component'
import {View4DataTableComponent} from '../data-table/view4-data-table/view4-data-table.component'

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    encapsulation: ViewEncapsulation.None
})

export class DataTableComponent implements OnInit{
  tabLoadTimes: Date[] = [];
  _city;
  _hood;
  showData: boolean = false
  private vData : view1[];
  private updatedData = new Subject<view1[]>();
  
  @ViewChild(View2DataTableComponent) view2;
  @ViewChild(View1DataTableComponent) view1;
  @ViewChild(View3DataTableComponent) view3;
  @ViewChild(View4DataTableComponent) view4;

  constructor(private toggleService: ToggleService,
   private dataTable: DataTableService) {
   }
    
  getValue() {
    this._city=this.dataTable.sendCity();
    this._hood=this.dataTable.sendHood(); 
  }
  getToggle() {
    this.toggleService.changeViewOneTable.subscribe(
      (showData)=> {
        this.showData = !this.showData;
    })
  }
  ngOnInit() {
    this.getValue();
    this.getToggle();
  }
  view2Data(){
    this.view2.getUpdatedData();
  }
  ngAfterViewInit(){
    this.view1.getUpdatedData();
    this.view2.getUpdatedData();
    this.view3.getUpdatedData();
    this.view4.getUpdatedData();
  }
}
