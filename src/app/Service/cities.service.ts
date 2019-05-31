import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class CitiesService {
 
  constructor(private http: HttpClient) {}
  
  getCity() {
    return this.http.get<string[]>('http://localhost:3000/showcities/')
      .pipe(
        tap(
          data => console.log("From getCity in Cities Service: " + JSON.stringify(data))
        )
      );
   }

}