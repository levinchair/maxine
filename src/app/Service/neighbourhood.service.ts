import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from "rxjs/operators";
import { CitiesService } from './cities.service';

@Injectable({providedIn: 'root'})

export class NeighbourhoodService {
    private selectedCity;
    private selectedHood = null;
    private onSelectFlag :boolean;
    private _city;
    private _hood;

    constructor(private http: HttpClient,
        private cityService: CitiesService,) {}

    setSelectedcity(selectedCity : string) {
        this.selectedCity= selectedCity;
    }
    getSelectedCity() {
        return this.selectedCity;
    }
    setSelectedHood(selectedHood : string) {
        this.selectedHood= selectedHood;
    }
    getSelectedHood() {
        return this.selectedHood;
    }
    setOnselectFlag(onSelectflag : boolean) {
        this.onSelectFlag=onSelectflag;
    }
    getOnSelectFlag() {
        return this.onSelectFlag;
    }
    getNeighbourhood(city:string) {
        this.selectedCity=city;
        return this.http.get<string[]>(`http://localhost:3000/showhood/${this.selectedCity}`)
          .pipe(
              tap(
                  (data : string[]) => //console.log("From getNeighboorhood: " + JSON.stringify(data))
              )
          )
    }
    // this is the ulitmate method to get selected city and selected hood from neighbourhood component
    sendCity(_city: string) {
        this._city = _city;
        //console.log(this._city);
        return this._city;
    }
    sendNeighborhood(_hood: string) {
        this._hood = _hood;
        //console.log(this._hood);
        return this._hood;
    }
    // getCity(){
    //     console.log("printed after getting value in getCity()", this._city);
    //     return this._city.asObservable();
    // }
    // getNeighborhood() {
    //     console.log("printed after getting value in getNeighborhood()", this._hood);
    //     return this._hood.asObservable();
    // }
}
