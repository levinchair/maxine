var express= require('express')
var router= express.Router();
var utils = require('./utils');

/** This is router for sending and recieving owner concentration */

router.all("/concentration/:param?/:hood?", (req, res, next) => {
  utils.processOwnerConcentration(req.params.param, req.params.hood, req.body)
  .then((payload) => res.send(payload))
  .catch(err => next(err));
});

 router.all("/concentrationbylanduse/:param2?/:hood2?", (req,res,next) => {

    utils.processOwnerConcentration(req.params.param2, req.params.hood2, req.body).then(
    (payload) => { //callback

      var data = payload;
      var landuseSum = [];
      var cr4;
      var dataMod;
      //calculate data using filter, map, reduce
      for( var SiteCat of utils.VALID_LANDUSE){
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