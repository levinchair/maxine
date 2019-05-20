import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class CitiesService {
  private citiesUpdated = new Subject<string[]>();
  private cities;
  
  constructor(private http: HttpClient) {}
  
  getCity() {
    this.http.get<{cities: string[]}>('http://localhost:3000/showcities/')
      .subscribe( (cityData) => {
        
        this.cities = cityData;
        this.citiesUpdated.next([...this.cities]);
        // console.log(this.cities);          
    });
    return this.citiesUpdated.asObservable();
   }

}