import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, forkJoin } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import inside from 'point-in-polygon';
//Models
import { SearchOptions } from '../../model/SearchOptions.model';
import { SearchAddress } from 'src/model/search-address';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private _city : string;
  private _hood : string;
  private _landUse : string;
  private _arr : Array<String> = [];
  private _LANDUSE = ["Residential", "Commercial", "Government", "Industrial", "Institutional",
                    "Mixed", "Utility", null, "All"];
  currentView = "view1";
  currentAttr = "AssessedValue";
  search      = "";
  areas = [];
  firstVisit = false;
  cityBoundaries = [];
  neighborhoodBoundaries =[];
  enhancedLasso:Boolean = false;
  options : SearchOptions = new SearchOptions();
  // currentSiteCat = new Subject<any>();
  geocoderData = new Subject<any>();
  cityBounds   = new Subject<any>();
  geometryData = new Subject<any>();
  lassoGeometryData = new Subject<any>();
  neighborhoods = new Subject<string[]>();
  view1Data = new Subject<any>(); view1DataRaw: any;
  view2Data = new Subject<any>(); view2DataRaw: any;
  view3Data = new Subject<any>(); view3DataRaw: any;
  view4Data = new Subject<any>(); view4DataRaw: any;
  concentrationData = new Subject<any>(); concentrationDataRaw: any;
  landUseConcentrationData = new Subject<any>(); landUseConcentrationDataRaw: any;
  view1parcelData = new Subject<any>();
  filterOwnerData = new Subject<any>();
  filterMaxData = new Subject<any>();
  public showSpinner = new Subject<boolean>(); // public load spinner

  //data for the address search
  public searchAddr: SearchAddress;


  constructor(private http: HttpClient) { }

  setCity(city: string){
		this._city = city;
		//alert("city geo: " +this._city);
	}
	setHood(hood: string){
	   this._hood = hood;
     //alert("hood geo: " + this._hood);
  }
  setLandUse(landUse:string){
    this._landUse = landUse;
  }

  getGeoCoderData(){
    this.http.get("http://localhost:3000/getNeighborhoodBoundaries").subscribe(
      (data) => {
        this.geocoderData.next(data);
      }
    )
  }
  getCityBounds(){
    this.http.get("http://localhost:3000/getCitiesBoundaries").subscribe(
      (data) => {
        this.cityBounds.next(data);
      }
    )
  }
  getLassoGeometryData(cities:string[],hoods?:string[]){
    //take cities and hoods into account to create the least number of searches necessary
    //for now the only neighborhoodBounds are for Cleveland so it's simple but when
    //more are added this should be better optimized
    var search:any[] = [];
    for(var city of cities){
      if(hoods && city == 'Cleveland'){
        for(var hood of hoods){
          search.push(this.http.post(`http://localhost:3000/showgeometry/${city}/${hood}`,this.options));
        }
      }else{
        search.push(this.http.post(`http://localhost:3000/showgeometry/${city}/`,this.options));
      }
    }
    forkJoin(search).subscribe(results =>{
      this.lassoGeometryData.next(results);
    },
    err => {
      this.handleError(err);
    });
  }
  setParcelArray(arr: Array<String>){
    if(arr === undefined || arr.length == 0 || !Array.isArray(arr)){
        this._arr = [];
        delete this.options.parcelpins;
    }else {
        this._arr = [...arr];
        this.options.parcelpins = [...this._arr]; //set the options array
    }
  }
  resetParcelArray(){
    this._arr = [];
  }
  setGeocoderData(data){
    this.geocoderData.next(data);
  }
  setAreas(e:Array<String>){
    this.areas = e;

  }

  setAddressdata(searchM: SearchAddress){
    //instantiate a new searchAddress object here with the passed object
    //from the addressSearch component
    this.searchAddr = searchM;
    // console.log(this.searchAddr);

  }
  resetSearchOptionsData(){
    this.options = new SearchOptions();
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
  get_landUse(){
    return this._landUse;
  }
  getLanduse(){
    return this._LANDUSE;
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
    this.http.post(`http://localhost:3000/view1/${this._city}/${this._hood}`, this.options)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view1DataRaw = view;
      this.view1Data.next(view);
    });
    //set view2 data
    this.http.post(`http://localhost:3000/view2/${this._city}/${this._hood}`, this.options)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view2DataRaw = view;
      this.view2Data.next(view);
    });
    //Set view3 data
    this.http.post(`http://localhost:3000/view3/${this._city}/${this._hood}`, this.options)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view3DataRaw = view;
      this.view3Data.next(view);
    });
    //Set view4 data
    this.http.post(`http://localhost:3000/view4/${this._city}/${this._hood}`, this.options)
    .subscribe( (view) => {
      //console.log("view: " + JSON.stringify(view));
      this.view4DataRaw = view;
      this.view4Data.next(view);
    });
    this.getConcentrationValues(this._city, this._hood);

  }
  getbyParcelpins(cities:string[], neighborhoods:string[]){
    var search:any[] = [];
    for(var city of cities){
      if(neighborhoods && city == 'Cleveland'){
        for(var hood of neighborhoods){
          search.push(this.http.post(`http://localhost:3000/showgeometry/${city}/${hood}`, this.options));
        }
      }else{
        console.log(city);
        search.push(this.http.post(`http://localhost:3000/showgeometry/${city}/`, this.options));
      }
    }
    forkJoin(search).subscribe(results =>{
      this.geometryData.next(results);
      this.showSpinner.next(false);
    });
    this.getViews(); // get views with updated options object
  }

  getGeometry(){
    //console.log(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`);
     if(this._hood !== undefined && this._city !== undefined){
        this.http.post(`http://localhost:3000/showgeometry/${this._city}/${this._hood}`, this.options)
        .subscribe(view => {
          this.geometryData.next(view);
          this.showSpinner.next(false);
        },
        err =>{
          this.handleError(err);
        });
    }else if(this._hood === undefined && this._city !== undefined){
        this.http.post(`http://localhost:3000/showgeometry/${this._city}/`, this.options)
        .subscribe(view => {
          this.geometryData.next(view)
          this.showSpinner.next(false);
        },
        err => {
          this.handleError(err);
        });
    }
  }

  getCities() {
    return this.http.get<string[]>('http://localhost:3000/showcities/')
      .pipe(
        catchError(this.handleError)
      );
   }

   getNeighbourhood() {
       this.http.get<string[]>(`http://localhost:3000/showhood/${this._city}`)
         .subscribe( (hoods: string[]) => {
           if(hoods !== undefined || hoods.length != 0){
            hoods = hoods.map(hood => { // change null to All
              if(hood === null){
                return 'All'
              }else {
                return hood
              }
            });
           }
           this.neighborhoods.next(hoods);
         });
   }

   private getConcentrationValues(city, hood){
       this.http.post(`http://localhost:3000/concentration/${city}/${hood}`, this.options)
       .subscribe(
        (view) => {
          this.http.post(`http://localhost:3000/concentrationbylanduse/${city}/${hood}`, this.options)
          .pipe(catchError(this.handleError))
          .subscribe(
            (view) => { // trying to find another fix...
              this.landUseConcentrationDataRaw = view;
              this.landUseConcentrationData.next(view);
            });
          this.concentrationDataRaw = view;
          this.concentrationData.next(view);
        },
        error => this.handleError(error));
   }
   getFilterOwnerData(){
     this.http.post(`http://localhost:3000/owners/${this._city}/${this._hood}`,this.options)
     .subscribe(
       (view) => {
         //Data contains null values need to remove them
         var viewAll = [];
         if(view instanceof Array){
           for(var i = 0; i < view.length; i++){
             if(view[i] != null){
               viewAll.push(view[i]);
             }
           }
           this.filterOwnerData.next(viewAll);
         }else{
           this.filterOwnerData.next([]);
         }
       },
       error => this.handleError(error));
   }

   //returns string array of neighborhood/city name that contain lasso area param
   pointInsideBounds(lassoPoints:Number[][], boundaries:any[]){
     let returnVal:string[] = [];
     //iterates over each point in lassoPoints checking if the point is inside any of the
     //  boundaries passed(city/hood) and returns an array of each city/hood that contains
     //  any of the points in lassoPoints
     for(var point in lassoPoints){
       for(var bounds in boundaries){
         if(!returnVal.includes(boundaries[bounds].name)){//if city/hood in retVal
           if(inside(lassoPoints[point],boundaries[bounds].coordinates[0])){ //if point inside boundaries
           returnVal.push(boundaries[bounds].name);
         }}}
     }
     return returnVal;
   }
   getFilterMaxData(){
     this.http.post(`http://localhost:3000/maxproperties/${this._city}/${this._hood}`,this.options)
     .subscribe(
       (data) =>{
         this.filterMaxData.next(data);
        },
        err => this.handleError(err)
      );
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
