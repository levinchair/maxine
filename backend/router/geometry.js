var express= require('express')
var utils = require('./utils');
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;


//--------------------------------------------------Show  geometric features  for selected neighbourhood--------------------------------------
router.get("/showgeometry/:param?/:hood?",(req,res,next)=>{

    this.query = utils.createQuery(req.params.param, req.params.hood);

    var newJson = {};

      db.find(this.query,
			        {_id:0, type:1,"properties.parcelpin":1,"properties.par_city":1, "properties.SiteCat1":1,"properties.SiteCat2": 1,
              "properties.SPA_NAME":1,"geometry.type":1,"geometry.coordinates":1, "properties.total_squa":1, 
            "properties.deeded_own2":1, "properties.par_addr_a": 1},
	    (err,result)=>{ //callback
        if(err) return next("Error: " + err);
    		newJson = {
    			type: "FeatureCollection",
    			features: result
    		}
            res.json(newJson);
            console.log(newJson);
    });

  });

module.exports=router;

router.get("/getparcels/:geoObject?" , (req, res, next ) => {
  // this.obj should be in the form of a geojson object { "type" : "Polygon",coordinates" : [[...]]}
    if(req.params.geoObject === undefined)  res.status(500).send("Error: Please Specify geoObject");
    try { // convert string form parameter to JSON. will fail if not encapsulated in braces
    this.obj = JSON.parse(req.params.geoObject);
    } catch(e) {
      res.send("error: " + e);
    }
    //res.send(typeof this.obj + " value: " + JSON.stringify(this.obj.types)); 

    db.find( {
      geometry: {
         $geoIntersects : {
            $geometry: this.obj
          }
      }
   },
   {
          "properties.parcelpin" : 1,
          "properties.SPA_NAME" : 1
   }, (err , result) => {
     if (err) {
       res.send(err);
       console.log("error occurred");
     }else{
       console.log(result);
       res.json(result);
     }
   });



})

module.exports=router;