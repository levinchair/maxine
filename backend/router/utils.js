var upperCase = require('upper-case');
var db = require("../model/db.js").parcelDataModel;

const VALID_LANDUSE = ["Industrial", "Government", "Institutional", "Commercial", "Mixed", "Other", "Utility", "Residential"];


dbKeysArrays = new Map([
  ['parcelpins', {dbName: 'properties.parcelpin'}],
  ['owner', {dbName: 'properties.deeded_own2'}],
  ['abatement', {dbName: 'properties.tax_abatem'}],
  ['taxLanduse', {dbName: 'properties.tax_luc_de'}]
]);
dbKeysRange = new Map([
  ['acres', {dbName: 'properties.total_acre'}],
  ['value', {dbName: 'properties.gross_ce_2'}],
  ['scale_units', {dbName1: 'properties.total_com_', dbName2: 'properties.units2'}]
]);
dbKeysStrings = new Map([
  ['sitecat1', {dbName: 'properties.SiteCat1'}],
  ['sitecat2', {dbName: 'properties.SiteCat2'}]                
]);
const processOwnerConcentration =  async(param, hood, body) => {

    this.query = createQuery(param, hood, body); //this is the initial match query

    //var checkVacant = { $in: ["$properties.SiteCat2", ["Residential Vacant", "Commercial Vacant", "Industrial Vacant", "Vacant Agricultural"]]}
    var catfilter = { //filter for SiteCat to appropriate scale
        $switch: {
        branches: [
            {case: {$in: ["$properties.SiteCat1", VALID_LANDUSE.slice(0,5)]}, then: "$properties.total_com_"},
            {case: {$eq: ["$properties.SiteCat1", "Residential"]}, then: "$properties.Units2"},
            //{case: checkVacant, then: "$properties.total_acre"}
        ], 
        default: "$properties.total_acre"
        }
    }
    var full_value = { //grouped
        _id: null,
        tot_value: {
            $sum: catfilter
        },
        indivs: {
            $push: {
                Owner_name: "$properties.deeded_own2",
                SiteCat1: 
                            //{$cond: [checkVacant, "Vacant", 
                            "$properties.SiteCat1"
                            //]}
                            ,
                //SiteCat2: "$properties.SiteCat2",
                value: catfilter
            }
        }
    }
    var owner = { //grouped
        _id: "$indivs.Owner_name",
        tot_value: {$first: "$tot_value"},
        tot_OwnerValue: {$sum: "$indivs.value"},
        landuse: {$first: "$indivs.SiteCat1"}
    }
    var split = { //we need  to split the pipeline into two facets
        topCR4: [
        {$limit: 4}, 
        {$group: {
            _id: null, 
            numerator: {$sum: "$tot_OwnerValue"}, 
            indivs: { $push: { OwnerValue: "$tot_OwnerValue", OwnerName: "$_id", landuse: "$landuse"}}, 
            totvalue: {$first: "$tot_value"}
        }},
        {$unwind: "$indivs"},
        {$project: {
            _id: 0,
            OwnerName: "$indivs.OwnerName",
            OwnerValue: "$indivs.OwnerValue",
            landuse: "$indivs.landuse",
            MarketShare: {$cond: [{$eq: ["$totvalue", 0]}, 0, {$divide: ['$indivs.OwnerValue', "$totvalue"]}]},          
            CR4: {$cond: [{$eq: ["$totvalue", 0]}, 0, {$divide: ['$numerator', "$totvalue"]}]}
        }}
        ],
        otherParcels: [
        {$skip: 4},
        {$project: {
            _id: 0,
            OwnerName: "$_id",
            OwnerValue: "$tot_OwnerValue",
            landuse: "$landuse",
            MarketShare: {$cond: [{$eq: ["$tot_value", 0]}, 0, {$divide: ['$tot_OwnerValue', "$tot_value"]}]}
        }}
        ],
    }
    
    var pipeline = [
        {$match: this.query },
        {$group: full_value},
        {$unwind: "$indivs"},
        {$group: owner},
        {$sort: { tot_OwnerValue: -1}},
        {$facet: split},
        {$project: {
        rows: {$concatArrays: ["$topCR4", "$otherParcels"]}
        }},
        {$unwind: "$rows"},
        {$group: {
        _id: null,
        MarketCR4: {$first: "$rows.CR4"},
        indivs: {$push: { OwnerName: "$rows.OwnerName", OwnerValue: "$rows.OwnerValue", MarketShare: "$rows.MarketShare",landuse: "$rows.landuse"}}
        }},
        {$unwind: "$indivs"},
        {$project: {
        _id:0,
        MarketCR4: 1,
        MarketShare: "$indivs.MarketShare",
        OwnerValue: "$indivs.OwnerValue",
        OwnerName: "$indivs.OwnerName", 
        landuse: "$indivs.landuse"
        }}
    ]
    var a;
    var payload = [];
    
    try {
        for (const SiteCat of VALID_LANDUSE){
            console.log(SiteCat);
            Object.defineProperty(this.query, "properties.SiteCat1", { value : SiteCat, enumerable : true, writable: true });       
            console.log(this.query);
            //it would be nice if someone could figure out how to run these promises in parallel using Promise.all
            a = await db.aggregate(pipeline); //gets executed here. Promises are executed on the microtask queue
            payload = payload.concat(a);
        }
    }catch(err){
        throw err;
    }
    return payload;   

}

function createQuery(city, hood, body){
    //param could be an array or string
    query = {};
    if(city === undefined) throw new Error("Please Specify a City (undefined)");
    cityParsed = upperCase(city); // all cities are capital
    if(typeof cityParsed === "object") JSON.stringify(cityParsed); // make sure we are not passing an object
    query = {
      "properties.par_city": cityParsed
    }
    
    if(!isAllHood(hood)){ // add hood to query
      Object.defineProperty(query, "properties.SPA_NAME", { value : hood, enumerable : true });       
    }

    if(!body || Object.keys(body).length === 0){
      console.log("body is undefined");
    }else{
      //parse body
      let dbName = ''; // name of the field in the db
      let dbMatch = {}; // match value for the field 
      for(let key of Object.keys(body)){
        // console.log("Parsing key: " + key);
        if(dbKeysArrays.has(key)){
          dbName = dbKeysArrays.get(key).dbName;
          dbMatch = {$in: body[key]};
        }
        else if(dbKeysStrings.has(key)){
          // console.log("this is the residential key: " , key, body[key]);
          if(key === 'sitecat1' && isAllSiteCat1(body[key])){ //checks if key is 'All'
            continue;
          }

          dbName = dbKeysStrings.get(key).dbName;
          
          if(!isNull(body[key])){
            dbMatch = body[key];
          } else {
            dbMatch = null;
          }
        }
        else if(dbKeysRange.has(key)){
          if(key === 'scale_units'){
            //we need to know if residential lot or not
            //first check if SiteCat1 key exists
            //if does, then we need to change the dbname
            if(body['sitecat1'] !== undefined && VALID_LANDUSE.includes(body['sitecat1'])){

              if(body['sitecat1'] === 'Residential'){
                dbName = dbKeysRange.get(key).dbName2;
              }else{
                dbName = dbKeysRange.get(key).dbName1;
              }

              dbMatch = {$lte: body[key][1], $gte: body[key][0]};
            } else {
              throw new Error("cannot read scale_units because sitecat1 doesnt exist");
              // console.error("cannot read scale_units because sitecat1 doesnt exist, skipping key: " + key);
              // continue;
            }
          }else{
            dbName = dbKeysRange.get(key).dbName;
            dbMatch = {$lte: body[key][1], $gte: body[key][0]};
          }
        }else{
          throw new Error("Invalid Key: " + key);
          // console.error("Skipping Invalid Key: " + key);
          // continue;
        }
        Object.defineProperty(query, dbName, {value: dbMatch, enumerable: true, writeable: true, configurable: true});
      }
      console.log("This is the query object from utils.createQuery: " + JSON.stringify(query));
    }

    return query
    /** OLD CODE */
    // try{
    //   console.log("here is the passed argument: " + city + ", attempting to parse...");
    //   paramParsed = JSON.parse(param); //this will throw an error and exit if not possible to parse to JSON
    // }catch(e){ //if cannot parse to json, then assume it is a name of a city
    //   paramParsed = upperCase(param);
    //   console.log("Unable to parse, defaulting to city.");  
    // }
    // /**This is will be deprecated in the near future */
    // if(Array.isArray(paramParsed)) { 
    //   query = { 
    //     "properties.parcelpin": { $in: paramParsed }
    //   }
    // }else{
    //   if(typeof paramParsed === "object") JSON.stringify(paramParsed); // make sure we are not passing an object
    //   query = {
    //     "properties.par_city": paramParsed
    //   }
      
    //   if(!isAllHood(hood)){
    //     Object.defineProperty(query, "properties.SPA_NAME", { value : hood, enumerable : true });       
    //   }
    // }
    // return query;
  }

function isAllHood(x){
  return (x === undefined || x === 'undefined' || x === 'All' || x === 'Null')
}
function isAllSiteCat1(cat){
  return (cat === 'All')
}
function isNull(value){ // null will be a string from the frontend
  return (value === 'null')
}

  module.exports = { VALID_LANDUSE, processOwnerConcentration, createQuery };