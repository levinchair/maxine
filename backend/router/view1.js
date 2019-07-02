var express= require('express')
var router= express.Router()
var upperCase = require('upper-case')
var db = require("../model/db.js");

router.get("/view1/:city/:hood?",(req,res)=>{
    this.city= upperCase(req.params.city);
    var query = {
      "properties.par_city": this.city
    }
    if(req.params.hood !== undefined){
      //create another property in the query object with value req.params.hood and set enumerable to true,
      //so that JSON.stringify will parse it. 
      // little know fact, the property keys will be double quoted
      Object.defineProperty(query, "properties.SPA_NAME", { value : req.params.hood, enumerable : true });       
    }

    var totalAssVal; // total assessed Value (will be calculated)
    console.log( "QUERY TO MATCH: \n" + JSON.stringify(query)); 

    db.aggregate( [ {"$match": query},
                    { "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },
                    {"$project":{"_id":1,"Assval":1}}
                  ])//,function(err,data){
    .exec(function(err, data) {
         if(err){ 
            throw new Error(JSON.stringify(err));
          }else{
             console.log(JSON.stringify(data));
             totalAssVal = data.map(function (v) {return v.Assval;}); // Assval corresponds to the sum of the properties.gross_ce_2
             console.log("Total Assessed Value: "+totalAssVal);
          }
    });

      var totalSqFeet;
      // calculate total square feet area
      db.aggregate( [ { "$match": query},
                      { "$group":{ "_id":null, 
                                   "totalsqfeet": {"$sum":"$properties.total_com_"} 
                                 } 
                      },
                      { "$project":{"_id":0,
                                    "totalsqfeet":1}
                      }
                    ])
      .exec(function(err, data) {
            if(err){
                throw new Error(JSON.stringify(err));
            }else{
                console.log(JSON.stringify(data));
                totalSqFeet= data.map(function(v){ return v.totalsqfeet;});
                console.log("total SquareFeet Area : "+totalSqFeet);
                db.aggregate([ {"$match":query},
                               {"$group":{ "_id":{"cat":"$properties.SiteCat1"},
                                           "Scale":{"$sum":"$properties.total_com_"},
                                           "AssessedValue":{"$sum":"$properties.gross_ce_2"},
                                           "No_parcels":{"$sum":1}
                                         }},
                               {"$project":{ "Scale":1,
                                             "No_parcels":1, 
                                             "percOfLand":{"$divide":["$Scale",Number(totalSqFeet)]},
                                             "AssessedValue":1,
                                             "percOfAssessedVal":{"$divide":["$AssessedValue",Number(totalAssVal)]}}}])
                .exec(
                  function(err,result){
                    if(err)
                    {
                        console.log("error ocuured 3: "+err);
                    }
                    else{
                        console.log(JSON.stringify(result,undefined,2));
                        res.json(result);
                    }
                  });
              }
            });
});

module.exports=router;

router.get("/view1byparcel/:arr?", (req, res, next) => {
  /*This router will take an array of parcelpins  STRINGS and find the corresponding values specified by view1 */
  if(req.params.arr === undefined) return next("Error: Please Specify array of Parcels (undefined)");
  console.log("here is the passed argument: " + req.params.arr + ", attempting to parse...");
  this.arr = JSON.parse(req.params.arr); //this will throw an error and exit if not possible to parse to JSON
  if(!Array.isArray(this.arr)) return next("Error: Please Specify array of Parcels (not an array)");

  var query = { 
    "properties.parcelpin": { $in: this.arr}
  }
  var sum1 = { // this contains the sums for totals for the pipeline from the query
    _id: null,  // property to group by, set to null to sum all documents
    tot_assessedval: {$sum: "$properties.gross_ce_2"},
    tot_land:  {$sum: "$properties.total_com_"}, /* not sure if this works with residential buildings, might have to change */
    indivs:{
      $push: {
        indiv_pin: "$properties.parcelpin",
        indiv_assessed: "$properties.gross_ce_2",
        indiv_land: "$properties.total_com_",
        indiv_SiteCat1: "$properties.SiteCat1"
      }
    }
  }
  var proj = { // what values to include into next stage, as well as calculations.
    _id: 0,
    tot_assessedval: 1,
    tot_land: 1,
    cat:  "$indivs.indiv_SiteCat1", // indivs needs to be flattened in order for this to work. 
    tot_land: 1,
    percOfland: {$divide: ["$indivs.indiv_land", "$tot_land"]},
    percOfassessed: {$divide: [ "$indivs.indiv_assessed", "$tot_assessedval"]}
  }
  var sum2 = { //group by SiteCat1 
    _id: "$cat",
    tot_AssessedValue: {$first: "$tot_assessedval"},
    tot_Scale: {$first: "$tot_land" },
    No_parcels: {$sum: 1},
    percOfLand: {$sum: "$percOfland"},
    percOfAssessedval: {$sum: "$percOfassessed"}
  }
  var proj2 = {
    _id: 1,
    AssessedValue: {$multiply: ["$percOfAssessedval", "$tot_AssessedValue"]}, //get assessedValue for specific Cat
    Scale: {$multiply: ["$percOfLand", "$tot_Scale"]}, //get land Scale for Specific Cat
    No_parcels: 1,
    percOfLand: 1,
    percOfAssessedval: 1
  }
  var pipeline = [
    {$match: query}, 
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
