import { Injectable, OnInit, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { view1 } from '../../model/view1.model';
import { view2 } from '../../model/view2.model';

@Injectable({
  providedIn: 'root'
})
export class DataTable2Service{ 
    private _city;
    private _neighborhood; 
    private viewData;
    private dupviewData = [];
  
    private dataSource: view2[];
    private dataSource1: view1[];
    private updatedData1 = new Subject<view1[]>();
    private updatedData2 = new Subject<view2[]>();
    
  
  
    constructor(private http:HttpClient) { 
      this.viewData=[];
      this.dupviewData=[];  
      // this._city=null;
      // this._neighborhood=null;  
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
    
       getView2(city: string,hood:string){
           
          //  this._city=this.sendCity();
          //  this._neighborhood=this.sendHood();
          this._city=city;
           this._neighborhood=hood;
           console.log("city",this._city);
           console.log("hood",this._neighborhood);
           if(this._city!=null && this._neighborhood!=null)
           {
                  this.http.get<{viewData:view2[]}>(`http://localhost:3000/view2/${this._city}/${this._neighborhood}`)
                  .subscribe( (view) => {        
                  this.viewData=view;
                  console.log("viewData",JSON.stringify(this.viewData))
                  this.dupviewData.length=0;
                  this.viewData.forEach(v => {
                    // console.log("get v",v);
                      if(v._id != null && !this.dupviewData.includes(v._id)){
                      // console.log("put v",v)
                          this.dupviewData.push(v);              
                      }
                  })
                  console.log("DupviewData",JSON.stringify(this.dupviewData));
                  this.dataSource=this.dupviewData;
                  this.dataSource.sort((l,r)=>{
                    if(l._id <r._id )
                        return -1;
                    else if (l._id >r._id )
                        return 1;
                    else
                        return 0;
                  }) 
                  this.updatedData2.next([...this.dataSource]);
                  },()=>{
                    this.updatedData2.complete()});
            }
            else if(this._city!=null && this._neighborhood==null)
            {
                    this.http.get<{viewData:view2[]}>(`http://localhost:3000/view2/${this._city}`)
                    .subscribe( (view) => {        
                    this.viewData=view;
                    console.log("viewData",this.viewData)
                    this.dupviewData.length=0;
                    this.viewData.forEach(v => {
                      // console.log("get v",v);
                        if(v._id != null && !this.dupviewData.includes(v._id)){
                        // console.log("put v",v)
                            this.dupviewData.push(v);              
                        }
                    })
                    console.log("DupviewData",this.dupviewData);
                    this.dataSource=this.dupviewData;
                    this.dataSource.sort((l,r)=>{
                      if(l._id <r._id )
                          return -1;
                      else if (l._id >r._id )
                          return 1;
                      else
                          return 0;
                    }) 
                    this.updatedData2.next([...this.dataSource]);
                    },()=>{
                      this.updatedData2.complete()});

            }
          this.setHood(null);
          return this.updatedData2.asObservable();
  }
//  ngOnDestroy(){
//   this.setHood(null);
//  }

  //  getUpdatedData2() {
  //   return this.updatedData2.asObservable();
  //  }
}