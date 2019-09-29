var upperCase = require('upper-case');
var db = require("../model/db.js").parcelDataModel;

const VALID_LANDUSE = ["Industrial", "Government", "Institutional", "Commercial", "Mixed", "Other", "Utility", "Residential"];
const [RESIDENTIAL] = VALID_LANDUSE.slice(-1);


const processOwnerConcentration =  async(param, hood) => {

    this.query = createQuery(param, hood); //this is the initial match query

    //var checkVacant = { $in: ["$properties.SiteCat2", ["Residential Vacant", "Commercial Vacant", "Industrial Vacant", "Vacant Agricultural"]]}
    var catfilter = { //filter for SiteCat to appropriate value
        $switch: {
        branches: [
            {case: {$in: ["$properties.SiteCat1", VALID_LANDUSE.slice(0,5)]}, then: "$properties.total_com_"},
            {case: {$eq: ["$properties.SiteCat1", RESIDENTIAL]}, then: "$properties.Units2"},
            //{case: checkVacant, then: "$properties.total_acre"}
        ], 
        default: "$properties.total_acre"
        }
    }
    var full_value = {
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
    var owner = {
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

function createQuery(param, hood){
    //param could be an array or string
    query = {};
    if(param === undefined) throw new Error("Please Specify array of Parcels or a city (undefined)");
    try{
      console.log("here is the passed argument: " + param + ", attempting to parse...");
      paramParsed = JSON.parse(param); //this will throw an error and exit if not possible to parse to JSON
    }catch(e){ //if cannot parse to json, then assume it is a name of a city
      paramParsed = upperCase(param);
      console.log("Unable to parse, default to city. Parse Error: " + JSON.stringify(e));  
    }
    /**This is will be deprecated in the near future */
    if(Array.isArray(paramParsed)) { 
      query = { 
        "properties.parcelpin": { $in: paramParsed }
      }
    }else{
      if(typeof paramParsed === "object") JSON.stringify(paramParsed); // make sure we are not passing an object
      query = {
        "properties.par_city": paramParsed
      }
      
      if(!isAllHood(hood)){
        Object.defineProperty(query, "properties.SPA_NAME", { value : hood, enumerable : true });       
      }
    }
    return query;
  }

function isAllHood(x){
  return (x === undefined || x === 'undefined' || x === 'All' || x === 'Null')
}

  module.exports = { VALID_LANDUSE, processOwnerConcentration, createQuery };