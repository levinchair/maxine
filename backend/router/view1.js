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
                        console.log(JSON.stringify(result,undefined,2))
                        res.json(result);

                    }
                  });
              }
            });
});

module.exports=router;


