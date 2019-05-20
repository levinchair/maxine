;
import { Subject } from 'rxjs';
var LocationService = /** @class */ (function () {
    function LocationService() {
        this.locationUpdated = new Subject();
    }
    LocationService.prototype.addLocation = function (lat, lng) {
        var _location = { latitude: lat, longitude: lng };
        this.location = _location;
        this.locationUpdated = this.location;
        console.log('from addLocation.locationService ', this.locationUpdated);
    };
    LocationService.prototype.getLocation = function () {
        console.log(this.locationUpdated);
        return this.locationUpdated.asObservable();
    };
    LocationService.prototype.setCity = function (city) {
        this._city = city;
        // console.log(this._city);
    };
    LocationService.prototype.setHood = function (hood) {
        this._neighborhood = hood;
        // console.log(this._neighborhood);
    };
    LocationService.prototype.sendCity = function () {
        // console.log(this._city);
        return this._city;
    };
    LocationService.prototype.sendHood = function () {
        // console.log(this._neighborhood);
        return this._neighborhood;
    };
    LocationService.prototype.setFlag = function () {
        this.flag = true;
    };
    LocationService.prototype.getFlag = function () {
        return true;
    };
    return LocationService;
}());
export { LocationService };
//# sourceMappingURL=location.service.js.map