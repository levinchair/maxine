var express= require('express')
var router= express.Router()
var parcelData = require("../model/db.js").parcelDataModel;
var cityBounds = require("../model/db.js").cityBoundsModel;

 router.all("/showcities",(req,res,next)=>{
    parcelData.distinct("properties.par_city")
    .exec(function(err, result) {
      if(err) {
       // res.send('error occured')
       res.status(err.status >= 100 && err.status < 600 ? err.code : 500).send(err.message);
      } else {
        // console.log(result);
        res.json(result);
       // res.end(result);
        //res.send(result,{cities:cities});
      }
    });
    //next();
});

router.all("/getCitiesBoundaries", (req,res,next) => {
  cityBounds.find().exec( (err, result) => {
    if(err) {
       throw new Error("Error at Aggregation: " + err.message);
     } else {
      result = result.filter(x => x !== 'NULL');
      newJson = {
        type: "FeatureCollection",
        name: "cityBoundaries",
        crs: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        },
        features: result
      }
      res.json(newJson);
     }
  });
});
module.exports=router;