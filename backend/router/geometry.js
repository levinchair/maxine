var express= require('express')
var upperCase = require('upper-case');
var router= express.Router()
var db = require("../model/db.js");


//--------------------------------------------------Show  geometric features  for selected neighbourhood--------------------------------------
router.get("/showgeometry/:city/:hood?",(req,res,next)=>{
    this.city=req.params.city

    //check to see if hood is undefined, else show all  
    if(req.params.hood !== undefined){
      this.hood=req.params.hood
    } else {
      this.hood = { $exists : true}
    }
    this.city= upperCase(this.city);
    console.log("This hood: " + this.hood);
	  var newJson = {};
    //db.distinct("geometry",{"properties.SPA_NAME":"Stockyards"})
    //db.findOne({"properties.SPA_NAME":this.hood,"properties.PAR_CITY":this.city},{_id:1,"properties.PARCELPIN":1,"properties.PAR_CITY":1,"properties.SPA_NAME":1,"geometry.type":1,"geometry.coordinates":1},(err,result)=>{
    //.exec(function(err, result) {
    //
      db.find({"properties.SPA_NAME":this.hood,"properties.PAR_CITY":this.city},
			        {_id:0, type:1,"properties.PARCELPIN":1,"properties.PAR_CITY":1, "properties.SiteCat1":1,
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
