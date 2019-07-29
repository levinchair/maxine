export interface JsonForm {
	_id?: any,
	properties?: { parcelpin: String, par_city: String, SPA_NAME: String, SiteCat1: String, SiteCat2: String, par_addr_a: String, total_squa: string, deeded_own2: string},
	id?: Number,
	geometry?:  {type: String, coordinates: Array<Array<Array<Array<Number>>>>}
}
