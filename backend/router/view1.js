var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var utils = require("./utils");

router.get("/view1/:param?/:hood?", (req, res, next) => {
  /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by view1
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */
  if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
  
  this.query = utils.createQuery(req.params.param, req.params.hood);
 
  var sum1 = { // this contains the sums for totals for the pipeline from the query
    _id: null,  // property to group by, set to null to sum all documents
    tot_assessedval: {$sum: "$properties.gross_ce_2"},
    tot_land:  {$sum: "$properties.total_acre"}, // total are of land
    indivs:{
      $push: { // creates an array
        indiv_pin: "$properties.parcelpin",
        indiv_assessed: "$properties.gross_ce_2",
        indiv_land: "$properties.total_acre",
        indiv_SiteCat1: "$properties.SiteCat1",
        indiv_SiteCat2: "$properties.SiteCat2",
        indiv_Scale: { // scale measured by units for residential
          $cond: {
            if: {$eq: ["$properties.SiteCat1", "Residential"]},
            then: "$properties.Units2", 
            else: "$properties.total_com_"
          }
        }
      }
    }
  }
  var proj = { // what values to include into next stage, as well as calculations.
    _id: 0,
    tot_assessedval: 1,
    tot_land: 1,
    //"indivs.indiv_SiteCat2": 1,
    cat:  { 
      $cond: { // checks to see if it is vacant land
        if: { $in: ["$indivs.indiv_SiteCat2", ["Residential Vacant", "Commercial Vacant", "Industrial Vacant", "Vacant Agricultural"]] },
        then: "Vacant",
        else: "$indivs.indiv_SiteCat1"
      }
    }, // indivs needs to be flattened in order for this to work. 
    scale: "$indivs.indiv_Scale",
    tot_land: 1,
    percOfland: { $divide: ["$indivs.indiv_land", "$tot_land"]},
    percOfassessed: {$divide: [ "$indivs.indiv_assessed", "$tot_assessedval"]}
  }
  var sum2 = { //group by SiteCat1 (cat)
    _id: "$cat",
    tot_AssessedValue: {$first: "$tot_assessedval"},
    tot_Scale: {$sum: "$scale" }, //tot scale for each cat
    No_parcels: {$sum: 1},
    percOfLand: {$sum: "$percOfland"},
    percOfAssessedVal: {$sum: "$percOfassessed"}
  }
  var proj2 = {
    _id: 0,
    cat: "$_id",
    AssessedValue: {$multiply: ["$percOfAssessedVal", "$tot_AssessedValue"]}, //get assessedValue for specific Cat
    Scale: "$tot_Scale", 
    No_parcels: 1,
    percOfLand: 1,
    percOfAssessedVal: 1
  }
  var pipeline = [
    {$match: this.query}, 
    {$group: sum1}, 
    {$unwind: "$indivs"}, //flattens $indivs to separate documents/objects
    {$project: proj},
    {$group: sum2},
    {$project: proj2}
  ]
  db.aggregate(pipeline).allowDiskUse(true).exec(
    function(err, result){ //callback
      if(err) return next("Error at aggregation: " + err);
      console.log(result);
      res.send(result);
    }
  );

});
module.exports=router;
