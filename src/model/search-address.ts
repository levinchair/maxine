//this model only pertains to search addresses. Will be usd in central service
export class SearchAddress {
    constructor(
        public streetNum: string,
        public streetName: string,
        public areaOfInterest: string,
        public cityName?: string,
        public zipcode?: string,
    ){}
}
