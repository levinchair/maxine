import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { CitiesService } from './cities.service';

@Injectable({providedIn: 'root'})

export class NeighbourhoodService {
    private neighbourhood;
    private neighbourhoodUpdated = new Subject<string[]>();
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
        this.http.get<{neighbourhood: string[]}>(`http://localhost:3000/showhood/${this.selectedCity}`)
          .subscribe( (neighbourhoodData) => {
            this.neighbourhood = neighbourhoodData;
            this.neighbourhoodUpdated.next([...this.neighbourhood]);
        });
        return this.neighbourhoodUpdated.asObservable();
    }
    // this is the ulitmate method to get selected city and selected hood from neighbourhood component
    sendCity(_city: string) {
        this._city = _city;
        console.log(this._city);
        return this._city;
    }  
    sendNeighborhood(_hood: string) {
        this._hood = _hood;
        console.log(this._hood);
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