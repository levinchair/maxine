var express= require('express')
var upperCase = require('upper-case')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;

//--------------------------------------------------Show distinct neighbourhood  from selected cities--------------------------------------
router.get("/showhood/:city",(req,res,next)=>{
   this.city=req.params.city
  this.city= upperCase(this.city);
  console.log("selected cities ",this.city);
    db.distinct("properties.SPA_NAME",{"properties.par_city":this.city})
    .exec(function(err, result) {
      if(err) {
       // res.send('error occured')
        res.status(err.status >= 100 && err.status < 600 ? err.code : 500).send(err.message);
      } else {
        result = result.filter(x => x !== 'NULL');
        console.log(result);
        res.json(result);
        /* res.write(result);
        res.end(result); */
      }
    });
    //next();
});
module.exports=router;