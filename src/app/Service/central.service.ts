import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
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
  private LANDUSE = ["Residential", "Commercial", "Government", "Industrial", "Institutional",
                    "Mixed", "Utility", null, "All"];
  currentView = "view1";
  currentAttr = "AssessedValue";
  search      = "";
  areas = [];
  currentSiteCat = new Subject<any>();
  geocoderData = new Subject<any>();
  geometryData = new Subject<any>();
  neighborhoods = new Subject<string[]>();
  view1Data = new Subject<any>();
  view2Data = new Subject<any>();
  view3Data = new Subject<any>();
  view4Data = new Subject<any>();
  concentrationData = new Subject<any>();
  landUseConcentrationData = new Subject<any>();
  view1parcelData = new Subject<any>();
  //used by other components to turn on loading spinner
  public showSpinner = new Subject<boolean>();

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
    if(arr === undefined || arr.length == 0 || !Array.isArray(arr)){
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
  setGeocoderData(data){
    this.geocoderData.next(data);
  }
  setAreas(e:Array<String>){
    this.areas = e;

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

  getLanduse(){
    return this.LANDUSE;
  }

  resizeAreas(domE:String){
    //areas is an array of length 0-2 contains area to remove
    if(this.areas.length == 1){
      //Remove one area "map","chart","tables"
        if(this.areas[0] == domE){
          return{'base':false,'half':false,'full':false,'hidden':true};
        }else{
          return{'base':false,'half':true,'full':false,'hidden':false};
        }
    }else if(this.areas.length == 2){
      //Make one of the areas full screen
      if(this.areas[0] == domE || this.areas[1] == domE){
        return{'base':false,'half':false,'full':false,'hidden':true};
      }else{
        return{'base':false,'half':false,'full':true,'hidden':false};
      }
    }else{
      //Base case
      return {'base':true,'half':false,'full':false,'hidden':false};
    }
  }
  //------ Get data from Database -----------//
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
    .subscribe(view => {
          this.geometryData.next(view);
          //spinner will be turned off after geometry is loaded
          this.showSpinner.next(false);
    });
  }

  getGeometry(){
    //console.log(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`);
     if(this._hood !== undefined && this._city !== undefined){
        this.http.get(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`)
        .subscribe(view => {
          this.geometryData.next(view);
          this.showSpinner.next(false);
        });
    }else if(this._hood === undefined && this._city !== undefined){
        this.http.get(`http://localhost:3000/showgeometry/${this._city}/`)
        .subscribe(view => {
          this.geometryData.next(view)
          this.showSpinner.next(false);
        });
    }
  }

  getCities() {
    return this.http.get<string[]>('http://localhost:3000/showcities/')
      .pipe(
        // tap(data => console.log("From getCity in Cities Service: " + JSON.stringify(data))),
        catchError(this.handleError)
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
       this.http.get(`http://localhost:3000/concentration/${city_or_arr}/${hood}`)
       .subscribe(
        (view) => {
          this.http.get(`http://localhost:3000/concentrationbylanduse/${city_or_arr}/${hood}`)
          .pipe(catchError(this.handleError))
          .subscribe(
            (view) => { // trying to find another fix...
              this.landUseConcentrationData.next(view);
            });
          this.concentrationData.next(view);
        },
        error => this.handleError(error));
   }

   private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.log('An error has occurred:  ', error.error.message);
    }else {
      //the backend returned an unsuccessful response code
      // the response body may contain clues to what went wrong
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `,error.error);
    }
    // return an abservable with a user-friendly error message
    return throwError('Something bad happened, try again later.')
   }
}
