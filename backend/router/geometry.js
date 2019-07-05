var express= require('express')
var upperCase = require('upper-case');
var router= express.Router()
var db = require("../model/db.js");


//--------------------------------------------------Show  geometric features  for selected neighbourhood--------------------------------------
router.get("/showgeometry/:city/:hood?",(req,res,next)=>{
    this.city=req.params.city;
    var query = {};
    this.city= upperCase(this.city); // all city names are capital in the database
                                     // only the first letter of the neighbourhood is capital
    query["properties.par_city"] = this.city;

    var newJson = {};
    //check to see if hood is undefined, else show all
    if(req.params.hood !== undefined){
      query["properties.SPA_NAME"] = req.params.hood;
    }

      db.find(query,
			        {_id:0, type:1,"properties.parcelpin":1,"properties.par_city":1, "properties.SiteCat1":1,"properties.SiteCat2": 1,
              "properties.SPA_NAME":1,"geometry.type":1,"geometry.coordinates":1},
	    (err,result)=>{
        if(err) {
            res.send(err);
            console.log("error occured");
          } else {
            //console.log(JSON.parse(result));
            console.log(result);
    		//wrap the resut in a new object to allow AGM maps to read it.
    		newJson = {
    			type: "FeatureCollection",
    			features: result
    		}
            res.json(newJson);
            //res.write(result);
            //res.end(result);
          }
      //next();
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