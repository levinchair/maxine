var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var utils = require("./utils");



router.get("/owners/:city?/:hood?", (req, res, next) => {
    //make the query to get the owners
    this.query = utils.createQuery(req.params.city, req.params.hood);
    console.log(this.query);
    //connect to the data base and retrieve the information 
    db.distinct("properties.deeded_own2", this.query).exec(
        (err , result ) => {
            if(err) return next("Error when retreiving Owners", err);
            res.send(result);            
        });
  });

module.exports=router;
