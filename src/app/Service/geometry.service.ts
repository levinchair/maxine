import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {tap} from 'rxjs/operators';

//import { JsonForm } from "../../model/jsonform.model";
/* featurecollection is the type for the json response */
import { featureCollection } from  "../../model/featurecollection.model";

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
	private _city;
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
	getGeometry(){
		 //alert(this._hood);
     //removed <featureCollection> for compatability with leaflet
		return this.http.get(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`)
          .pipe( // rxJS pipe runs multiple RxJS operators
			tap( // tap will allow me to peek into the response before subscribe
				// for some reason i am forced to check this.
				(data: any) => console.log("geo data: " + JSON.stringify(data)),
				error => alert("Error: " + error)
			)
		  );
	}

}
