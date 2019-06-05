export interface JsonForm {
	_id?: any,
	properties?: { PARCELPIN: String, par_city: String, spa_name: String, SiteCat1: String},
	id?: Number,
	geometry?:  {type: String, coordinates: Array<Array<Array<Number>>>}
}
