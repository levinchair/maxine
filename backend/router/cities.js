var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
 router.all("/showcities",(req,res,next)=>{
    var cities=[10000];
    db.distinct("properties.par_city")
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
module.exports=router;