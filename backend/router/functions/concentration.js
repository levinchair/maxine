var utils = require("../utils.js");
var db = require("../../model/db.js").parcelDataModel;

const VALID_LANDUSE = ["Industrial", "Government", "Institutional", "Commercial", "Mixed", "Other", "Utility", "Residential"];
const [RESIDENTIAL] = VALID_LANDUSE.slice(-1);


const processOwnerConcentration =  async(param, hood) => {

    this.query = utils.createQuery(param, hood); //this is the initial match query

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

module.exports = {
    VALID_LANDUSE,
    processOwnerConcentration
}
