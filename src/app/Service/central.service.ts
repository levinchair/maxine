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
  private _city;
  private _hood;
  private _arr : Array<String> = [];
  private _arrStr: String;
  view1Data = new Subject<any>();
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
    for(var i =0; i < arr.length; i++){ // needs to be an array of only parcelpins
      this._arr.push(arr[i].properties.parcelpin);
    }
    this._arrStr = JSON.stringify(this._arr);
    // console.log(this._arr);
    // console.log(this._arrStr);
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
  getChartData(){
    this.http.get(`http://localhost:3000/view1/${this._city}/${this._hood}`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view1Data.next(view);
    });
  }

  getbyParcelpins(){
    this.http.get(`http://localhost:3000/view1/${this._arrStr}/`)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view1Data.next(view); // this will set view1Data, which will multicast it to all oberservers that are subscribed 
    });
  }

  getGeometry(){
     //removed <featureCollection> for compatability with leaflet
     if(this._hood !== undefined && this._city !== undefined){
      return this.http.get(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`)
            .pipe( // rxJS pipe runs multiple RxJS operators
        tap( // tap will allow me to peek into the response before subscribe
          // for some reason i am forced to check this.
          (data: any) => console.log("geo data: "),
          error => alert("Error: " + error)
        )
        );
    }else if(this._hood === undefined && this._city !== undefined){
        return this.http.get(`http://localhost:3000/showgeometry/${this._city}/`)
            .pipe( // rxJS pipe runs multiple RxJS operators
        tap( // tap will allow me to peek into the response before subscribe
          // for some reason i am forced to check this.
          (data: any) => console.log("geo data: "),
          error => alert("Error: " + error)
        )
        );
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

   getNeighbourhood(city:string) {
       this._city = city;
       return this.http.get<string[]>(`http://localhost:3000/showhood/${this._city}`)
         .pipe(
             tap(
                 (data : string[]) => console.log("From getNeighboorhood: " + JSON.stringify(data))
             )
         )
   }
}
