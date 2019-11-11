var express= require('express')
var upperCase = require('upper-case')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var neighbourhoodBoundaries = require("../model/db.js").neighborhoodBoundariesModel;

//--------------------------------------------------Show distinct neighbourhood  from selected cities--------------------------------------
router.all("/showhood/:city",(req,res,next)=>{
   this.city=req.params.city
  this.city= upperCase(this.city);
  // console.log("selected cities ",this.city);
    db.distinct("properties.SPA_NAME",{"properties.par_city":this.city})
    .exec(function(err, result) {
      if(err) {
       // res.send('error occured')
        res.status(err.status >= 100 && err.status < 600 ? err.code : 500).send(err.message);
      } else {
        result = result.filter(x => x !== 'NULL');
        res.json(result);
      }
    });
});

router.all("/getNeighborhoodBoundaries", (req,res,next) => { //get neighborhood boundaries
  neighbourhoodBoundaries.find().exec( (err, result) => {
    if(err) {
       throw new Error("Error at Aggregation: " + err.message);
     } else {
      result = result.filter(x => x !== 'NULL');
      newJson = {
        type: "FeatureCollection",
        name: "neighborhoodBoundaries",
        features: result
      }
      res.json(newJson);
     }
  });
});


module.exports=router;