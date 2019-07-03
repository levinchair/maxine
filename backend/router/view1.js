var express= require('express')
var router= express.Router()
var upperCase = require('upper-case')
var db = require("../model/db.js");

router.get("/view1/:param?/:hood?", (req, res, next) => {
  /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by view1
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */
  if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
  console.log("here is the passed argument: " + req.params.param + ", attempting to parse...");
  try{
    this.param = JSON.parse(req.params.param); //this will throw an error and exit if not possible to parse to JSON
  }catch(e){ //if cannot parse to json, then assume it is a name of a city
    this.param = upperCase(req.params.param);
    console.log("Unable to parse, default to city");  
  }
  
  this.query = {};
  if(Array.isArray(this.param)) {
    this.query = { 
      "properties.parcelpin": { $in: this.param }
    }
  }else{
    if(typeof this.param === "object") JSON.stringify(this.param); // make sure we are not passing an object
    this.query = {
      "properties.par_city": this.param
    }
    if(req.params.hood !== undefined){
      Object.defineProperty(this.query, "properties.SPA_NAME", { value : req.params.hood, enumerable : true });       
    }
  }

  
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
    cat:  "$indivs.indiv_SiteCat1", // indivs needs to be flattened in order for this to work. 
    scale: "$indivs.indiv_Scale",
    tot_land: 1,
    percOfland: { $divide: ["$indivs.indiv_land", "$tot_land"]},
    percOfassessed: {$divide: [ "$indivs.indiv_assessed", "$tot_assessedval"]}
  }
  var sum2 = { //group by SiteCat1 
    _id: {cat: "$cat"},
    tot_AssessedValue: {$first: "$tot_assessedval"},
    tot_Scale: {$sum: "$scale" }, //tot scale for each cat
    No_parcels: {$sum: 1},
    percOfLand: {$sum: "$percOfland"},
    percOfAssessedVal: {$sum: "$percOfassessed"}
  }
  var proj2 = {
    _id: 1,
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
  db.aggregate(pipeline).exec(
    function(err, result){ //callback
      if(err) return next("Error at aggregation: " + err);
      console.log(result);
      res.send(result);
    }
  );

});
module.exports=router;
