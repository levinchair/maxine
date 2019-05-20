var express= require('express')
var router= express.Router()
var db = require("../model/db.js");


//--------------------------------------------------Show  geometric features  for selected neighbourhood--------------------------------------
router.get("/showgeometry",(req,res,next)=>{
    this.city=req.params.city
    this.hood=req.params.hood
    this.city= upperCase(this.city);
    //db.distinct("geometry",{"properties.SPA_NAME":"Stockyards"})
    //db.findOne({"properties.SPA_NAME":this.hood,"properties.PAR_CITY":this.city},{_id:1,"properties.PARCELPIN":1,"properties.PAR_CITY":1,"properties.SPA_NAME":1,"geometry.type":1,"geometry.coordinates":1},(err,result)=>{
    //.exec(function(err, result) {
      db.findOne({"properties.SPA_NAME":"University","properties.PAR_CITY":"CLEVELAND"},{_id:1,"properties.PARCELPIN":1,"properties.PAR_CITY":1,"properties.SPA_NAME":1,"geometry.type":1,"geometry.coordinates":1},(err,result)=>{  
    if(err) {
        res.send(err);
        console.log("error occured");
      } else {
        //console.log(JSON.parse(result));
        console.log(result);
        res.json(result);
        //res.write(result);
        //res.end(result);
      }
      //next();
    });
  });
  
module.exports=router;