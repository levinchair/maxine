import { Location } from '../../model/location.model';;
import { Subject, Observable } from 'rxjs';

export class LocationService {
  private locationUpdated = new Subject<Location>();
  private location;
  private _city;
  private _neighborhood;
  private flag;
  address: string;
  addLocation(lat: number, lng: number) {
    let _location: Location = {latitude: lat, longitude: lng};
    this.location =_location;
    this.locationUpdated=this.location;
    console.log('from addLocation.locationService ', this.locationUpdated);
  }

  getLocation() {
    console.log(this.locationUpdated)
    return this.locationUpdated.asObservable();
  }
  setCity(city: string){
    this._city = city;
    // console.log(this._city);
  }
  setHood(hood: string){
    
    this._neighborhood = hood;
    // console.log(this._neighborhood);
  }
  sendCity(){
    // console.log(this._city);
    return this._city;
  }
  sendHood(){
    // console.log(this._neighborhood);
    return this._neighborhood;
  }
  setFlag(flag :boolean){
    this.flag= flag;
  }
  getFlag()
  {
    return this.flag;
  }
  setHeader(address :string)
  {
    this.address=address;
  }
  getHeader()
  {
    return this.address;
  }
  toggleFlag(){
    this.flag!=this.flag;
    return this.flag;
  }
}
