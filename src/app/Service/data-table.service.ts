import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { view1 } from '../../model/view1.model';
import { view2 } from '../../model/view2.model';
@Injectable({
  providedIn: 'root'
})
export class DataTableService{
  private _city;
  private _neighborhood;
  private viewData;
  private dupviewData = [];

  private dataSource2: view2[];
  private dataSource: view1[];
  private updatedData1 = new Subject<view1[]>();
  private updatedData2 = new Subject<view2[]>();
  // variables for view1-chart
  private xIDChart:any;
  private yLandChart: Array<number>;
  private updatedData;

  constructor(private http:HttpClient) {
    this.viewData=[];
    this.dupviewData=[];
  }

  setCity(city: string){
    this._city = city;
    // console.log(this._city);
  }
  setHood(hood: string){

    this._neighborhood = hood;
    // console.log(this._neighborhood);
  }
  sendCity(){
    // console.log(this._city);
    return this._city;
  }
  sendHood(){
    // console.log(this._neighborhood);
    return this._neighborhood;
  }

  sendXVview1() {
    return this.xIDChart.asObservable();
  }
  setData(data){
    //console.log("setData",data);
    this.updatedData=data;
  }
  public getData():any{
    const dataObservable = new Observable(observer=>{
      observer.next(this.updatedData);
    });
    //console.log("get data:",this.updatedData);
    return dataObservable;

    // return this.updatedData;
  }

  // view1 methods: getView1() and getUpdatedData1()
  getView1(){

        this._city=this.sendCity();
        this._neighborhood=this.sendHood();
        //console.log("city",this._city);
        //console.log("hood",this._neighborhood);
        if(this._city!=null && this._neighborhood!=null)
        {
              this.http.get<{viewData:view1[]}>(`http://localhost:3000/view1/${this._city}/${this._neighborhood}`)
              .subscribe( (view) => {
                this.dupviewData.length=0;
                this.viewData=view;
                this.viewData.forEach(v => {
                  if(v._id.cat != null && !this.dupviewData.includes(v._id.cat)){
                    this.dupviewData.push(v);
                  }
              })
              this.dataSource=this.dupviewData;

              console.log(this.dataSource);
              //this.dupviewData.length=0;
              this.dataSource.sort((l,r)=>{
                if(l._id.cat < r._id.cat )
                    return -1;
                else if (l._id.cat >r._id.cat )
                    return 1;
                else
                    return 0;
              })

              this.updatedData1.next([...this.dataSource]);
              console.log("updatedData1 ",this.dataSource);
              this.setData(this.dataSource);

//----------------------------------------------------------------------------chart----------------------------------------------------

              // this.dataSource1=this.viewData;
              // this.dataSource1.sort((l,r)=>{
              //   if(l._id.cat <r._id.cat )
              //       return -1;
              //   else if (l._id.cat >r._id.cat )
              //       return 1;
              //   else
              //       return 0;
              // })
              // taking ID and perOfLand for charts here:
              this.xIDChart = this.dataSource.map((d)=> { return d._id.cat});
              this.yLandChart = this.dataSource.map((d)=> { return d.percOfLand});
              this.xIDChart = this.xIDChart;
              this.yLandChart = this.yLandChart;
              console.log(this.xIDChart, this.yLandChart);

//----------------------------------------------------------------------------chart----------------------------------------------------
              },
              ()=>{
                this.updatedData1.complete();
              });
             // return this.updatedData1.asObservable();
        }
        else if(this._city!=null && this._neighborhood==null)
        {
              this.http.get<{viewData:view1[]}>(`http://localhost:3000/view1/${this._city}`)
              .subscribe( (view) => {
                this.dupviewData.length=0;
                this.viewData=view;
                this.viewData.forEach(v => {
                  if(v._id.cat != null && !this.dupviewData.includes(v._id.cat)){
                    this.dupviewData.push(v);
                  }
              })
              this.dataSource=this.dupviewData;
              console.log(this.dataSource)
              //this.dupviewData.length=0;
              this.dataSource.sort((l,r)=>{
                if(l._id.cat < r._id.cat )
                    return -1;
                else if (l._id.cat >r._id.cat )
                    return 1;
                else
                    return 0;
              })
              this.updatedData1.next([...this.dataSource]);
              this.setData(this.updatedData1);
//----------------------------------------------------------------------------chart----------------------------------------------------
              // this.dataSource1=this.viewData;
              // this.dataSource1.sort((l,r)=>{
              //   if(l._id.cat <r._id.cat )
              //       return -1;
              //   else if (l._id.cat >r._id.cat )
              //       return 1;
              //   else
              //       return 0;
              // })
              // taking ID and perOfLand for charts here:
              this.xIDChart = this.dataSource.map((d)=> { return d._id.cat});
              this.yLandChart = this.dataSource.map((d)=> { return d.percOfLand});
              this.xIDChart = this.xIDChart.slice(1);
              this.yLandChart = this.yLandChart.slice(1);
              console.log(this.xIDChart, this.yLandChart);
//----------------------------------------------------------------------------chart----------------------------------------------------
              },
              ()=>{

                this.updatedData1.complete();
              });

        }

        this.setHood(null);
        return this.updatedData1.asObservable();
  }

  // getUpdatedData1(){
  //   return this.updatedData1.asObservable();
  // }

  getView1Chart(){
    // slicing from 1 as 0 index is showing null ! need to fix this but can be seen later
    // TODO ---------------------------------------------------------------------------------------Heta
    /* From Heta:
    Neha, I was lately working on this function. The scene is the function isnt reached out. The reason
    is entire service is working only via observables, but this function is static. I am confused how to
    call this.xIDChart and this.yLandChart as an observable!
    */
    console.log('chart called');

    this.xIDChart = this.xIDChart.slice(1);
    this.yLandChart = this.yLandChart.slice(1);
    console.log("CHART",this.xIDChart, this.yLandChart);
  }

}
