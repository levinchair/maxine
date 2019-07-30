var express= require('express')
var router= express.Router();
var db = require("../model/db.js");
var utils = require('./utils');
var request = require("request");
var concentration = require('../concentration');


router.get("/concentration/:param?/:hood?", (req, res, next) => {
  concentration.processOwnerConcentration(req.params.param, req.params.hood)
  .then((payload) => res.send(payload))
  .catch(err => next(err));
});

 router.get("/concentrationbylanduse/:param2?/:hood2?", (req,res,next) => {

    concentration.processOwnerConcentration(req.params.param2, req.params.hood2).then(
    (payload) => { //callback

      var data = payload;
      var landuseSum = [];
      var cr4;
      var dataMod;
      //cal data using filter, map, reduce
      for( var SiteCat of concentration.VALID_LANDUSE){
        dataMod = data.filter( owner => owner.landuse === SiteCat);
        if(dataMod === undefined || dataMod.length == 0) {
          cr4 = 0;
          dataMod = 0;
        }else {
          cr4 = dataMod[0].MarketCR4;
          dataMod = dataMod.map( owner => owner.OwnerValue);
          dataMod = dataMod.reduce( (total, owner) => total + owner);
        }
        landuseSum.push({
          landuse: SiteCat,
          MarketCR4: cr4,
          landuseTot: dataMod,
          numerator: cr4*dataMod
        });
      }

      //console.log("landuseSum:       " + landuseSum);
      res.json(landuseSum);
    }).catch(err => next(err));
  
 });

 
 module.exports = router;