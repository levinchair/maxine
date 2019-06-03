import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

//Models
import { featureCollection } from  "../../model/featurecollection.model";

@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private _city = "Cleveland";
	private _hood;
  constructor(private http: HttpClient) { }

  setCity(city: string){
		this._city = city;
		//alert("city geo: " +this._city);
	}
	setHood(hood: string){
	   this._hood = hood;
     //alert("hood geo: " + this._hood);
	}
  getCity(){
    return this._city;
    //console.log(this._city);
  }
  getHood(){
    return this._hood;
    //console.log(this._hood);
  }

  changeState(){
  }

  getGeometry(){
     //removed <featureCollection> for compatability with leaflet
     if(this._hood !== undefined && this._city !== undefined){
      return this.http.get(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`)
            .pipe( // rxJS pipe runs multiple RxJS operators
        tap( // tap will allow me to peek into the response before subscribe
          // for some reason i am forced to check this.
          (data: any) => console.log("geo data: " + JSON.stringify(data)),
          error => alert("Error: " + error)
        )
        );
    }else if(this._hood === undefined && this._city !== undefined){
        return this.http.get(`http://localhost:3000/showgeometry/${this._city}/`)
            .pipe( // rxJS pipe runs multiple RxJS operators
        tap( // tap will allow me to peek into the response before subscribe
          // for some reason i am forced to check this.
          (data: any) => console.log("geo data: " + JSON.stringify(data)),
          error => alert("Error: " + error)
        )
        );
    }
  }
}
