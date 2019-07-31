import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {MatSortModule} from '@angular/material/sort';
//Models
import { featureCollection } from  "../../model/featurecollection.model";
import { view1 } from  "../../model/view1.model";
import { JsonForm } from '../../model/jsonform.model';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private _city = "Cleveland";
  private _hood = "Downtown";
  private _arr : Array<String> = [];
  private _arrStr: String;
  private _currentLandUse: String = "Commercial";
  currentView = "view1";
  geometryData = new Subject<any>();
  neighborhoods = new Subject<string[]>();
  view1Data = new Subject<any>();
  view2Data = new Subject<any>();
  view3Data = new Subject<any>();
  view4Data = new Subject<any>();
  concentrationData = new Subject<any>();
  landUseConcentrationData = new Subject<any>();
  view1parcelData = new Subject<any>();
  constructor(private http: HttpClient) { }

  setCity(city: string){
		this._city = city;
		//alert("city geo: " +this._city);
	}
	setHood(hood: string){
	   this._hood = hood;
     //alert("hood geo: " + this._hood);
  }
  setParcelArray(arr: Array<JsonForm>){
    if(Object.keys(arr).length === 0 || !Array.isArray(arr)){
      this._arr = [];
    }else {
      for(var i =0; i < arr.length; i++){ // needs to be an array of only parcelpins
        this._arr.push(arr[i].properties.parcelpin);
      }
    }
    this._arrStr = JSON.stringify(this._arr);
    // console.log(this._arr);
    //console.log(this._arrStr);
  }
  getCity(){
    return this._city;
    //console.log(this._city);
  }
  getHood(){
    return this._hood;
    //console.log(this._hood);
  }
  getParcelArray(){
    return this._arr;
  }

  changeView1(newData){
    this.view1Data.next(newData);
  }

  getViews(){
    //Set view1 data
    this.http.get(`http://localhost:3000/view1/${this._city}/${this._hood}`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view1Data.next(view);
    });
    //set view2 data
    this.http.get(`http://localhost:3000/view2/${this._city}/${this._hood}`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view2Data.next(view);
    });
    //Set view3 data
    this.http.get(`http://localhost:3000/view3/${this._city}/${this._hood}`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view3Data.next(view);
    });
    //Set view4 data
    this.http.get(`http://localhost:3000/view4/${this._city}/${this._hood}`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view4Data.next(view);
    });

    this.getConcentrationValues(this._city, this._hood);
    
  }
  //Ignore this for now(-_-)working on a better way
  getView(view){
    switch (view){
      case 'view1': return this.view1Data; break;
      case 'view2': return this.view2Data; break;
      case 'view3': return this.view3Data; break;
      case 'view4': return this.view4Data; break;
    }
  }
  getbyParcelpins(){
    this.http.get(`http://localhost:3000/view1/${this._arrStr}/`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view1Data.next(view); 
    });
    this.http.get(`http://localhost:3000/view2/${this._arrStr}/`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view2Data.next(view); 
    });
    this.http.get(`http://localhost:3000/view3/${this._arrStr}/`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view3Data.next(view); 
    });
    this.http.get(`http://localhost:3000/view4/${this._arrStr}/`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view4Data.next(view); 
    });
    this.getConcentrationValues(this._arrStr,undefined);
    this.http.get(`http://localhost:3000/showgeometry/${this._arrStr}/`)
    .subscribe(view => this.geometryData.next(view));
  }

  getGeometry(){
    console.log(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`);
     if(this._hood !== undefined && this._city !== undefined){
        this.http.get(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`)
        .subscribe(view => this.geometryData.next(view));
    }else if(this._hood === undefined && this._city !== undefined){
        this.http.get(`http://localhost:3000/showgeometry/${this._city}/`)
        .subscribe(view => this.geometryData.next(view));
    }
  }

  getCities() {
    return this.http.get<string[]>('http://localhost:3000/showcities/')
      .pipe(
        tap(
          data => console.log("From getCity in Cities Service: " + JSON.stringify(data))
        )
      );
   }

   getNeighbourhood() {
       this.http.get<string[]>(`http://localhost:3000/showhood/${this._city}`)
         .subscribe( (hoods: string[]) => {
           hoods = hoods.map(hood => { // change null to All
             if(hood === null){
               return 'All' 
             }else {
               return hood
             }
           });
           this.neighborhoods.next(hoods);
         });
   }

   private getConcentrationValues(city_or_arr, hood){
       // for some reason this request needs to be made before concentrationbylanduse
  
       this.http.get(`http://localhost:3000/concentration/${city_or_arr}/${hood}`)
       .subscribe( (view) => {
         //console.log("view: " + JSON.stringify(view));
         this.http.get(`http://localhost:3000/concentrationbylanduse/${city_or_arr}/${hood}`)
         .subscribe( (view) => { // trying to find another fix...
           //console.log("view: " + JSON.stringify(view));
           this.landUseConcentrationData.next(view);  
         });
         this.concentrationData.next(view); 
       });
   }
}
