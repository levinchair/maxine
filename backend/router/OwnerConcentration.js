var express= require('express')
var router= express.Router();
var db = require("../model/db.js");
var utils = require('./utils');
var request = require("request");

const VALID_LANDUSE = ["Industrial", "Government", "Institutional", "Commercial", "Mixed", "Other", "Utility", "Residential"];
const [RESIDENTIAL] = VALID_LANDUSE.slice(-1);

router.get("/concentration/:param?/:hood?", (req, res, next) => {
      /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by Concentration by Owner
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */
  
  this.query = utils.createQuery(req.params.param, req.params.hood); //this is the initial match query

  //var checkVacant = { $in: ["$properties.SiteCat2", ["Residential Vacant", "Commercial Vacant", "Industrial Vacant", "Vacant Agricultural"]]}
  var catfilter = { //filter for SiteCat to appropriate value
    $switch: {
      branches: [
        {case: {$in: ["$properties.SiteCat1", VALID_LANDUSE.slice(0,5)]}, then: "$properties.total_com_"},
        {case: {$eq: ["$properties.SiteCat1", RESIDENTIAL]}, then: "$properties.Units2"},
        //{case: checkVacant, then: "$properties.total_acre"}
      ], 
      default: "$properties.total_acre"
    }
  }
  var full_value = {
      _id: null,
      tot_value: {
          $sum: catfilter
      },
      indivs: {
          $push: {
              Owner_name: "$properties.deeded_own2",
              SiteCat1: 
                        //{$cond: [checkVacant, "Vacant", 
                        "$properties.SiteCat1"
                        //]}
                        ,
              //SiteCat2: "$properties.SiteCat2",
              value: catfilter
          }
      }
  }
  var owner = {
      _id: "$indivs.Owner_name",
      tot_value: {$first: "$tot_value"},
      tot_OwnerValue: {$sum: "$indivs.value"},
      landuse: {$first: "$indivs.SiteCat1"}
  }
  var split = { //we need  to split the pipeline into two facets
    topCR4: [
      {$limit: 4}, 
      {$group: {
          _id: null, 
          numerator: {$sum: "$tot_OwnerValue"}, 
          indivs: { $push: { OwnerValue: "$tot_OwnerValue", OwnerName: "$_id", landuse: "$landuse"}}, 
          totvalue: {$first: "$tot_value"}
      }},
      {$unwind: "$indivs"},
      {$project: {
        _id: 0,
        OwnerName: "$indivs.OwnerName",
        OwnerValue: "$indivs.OwnerValue",
        landuse: "$indivs.landuse",
        MarketShare: {$cond: [{$eq: ["$totvalue", 0]}, 0, {$divide: ['$indivs.OwnerValue', "$totvalue"]}]},          
        CR4: {$cond: [{$eq: ["$totvalue", 0]}, 0, {$divide: ['$numerator', "$totvalue"]}]}
      }}
    ],
    otherParcels: [
      {$skip: 4},
      {$project: {
        _id: 0,
        OwnerName: "$_id",
        OwnerValue: "$tot_OwnerValue",
        landuse: "$landuse",
        MarketShare: {$divide: ["$tot_OwnerValue", "$tot_value"]}
      }}
    ],
  }

  var pipeline = [
    {$match: this.query },
    {$group: full_value},
    {$unwind: "$indivs"},
    {$group: owner},
    {$sort: { tot_OwnerValue: -1}},
    {$facet: split},
    {$project: {
      rows: {$concatArrays: ["$topCR4", "$otherParcels"]}
    }},
    {$unwind: "$rows"},
    {$group: {
      _id: null,
      MarketCR4: {$first: "$rows.CR4"},
      indivs: {$push: { OwnerName: "$rows.OwnerName", OwnerValue: "$rows.OwnerValue", MarketShare: "$rows.MarketShare",landuse: "$rows.landuse"}}
    }},
    {$unwind: "$indivs"},
    {$project: {
      _id:0,
      MarketCR4: 1,
      MarketShare: "$indivs.MarketShare",
      OwnerValue: "$indivs.OwnerValue",
      OwnerName: "$indivs.OwnerName", 
      landuse: "$indivs.landuse"
    }}
  ]
  var a;
  var payload = [];
  const getData = async() => {
    try {
      for (const SiteCat of VALID_LANDUSE){
        console.log(SiteCat);
        Object.defineProperty(this.query, "properties.SiteCat1", { value : SiteCat, enumerable : true, writable: true });       
        console.log(this.query);
        //it would be nice if someone could figure out how to run these promises in parallel using Promise.all
        a = await db.aggregate(pipeline); //gets executed here. Promises are executed on the microtask queue
        payload = payload.concat(a);
      }
    }catch(err){
      throw err;
    }
    return payload;
  }
  getData()
  .then((payload) => res.send(payload))
  .catch(err => next(err));
 });

 router.get("/concentrationbylanduse/:param?/:hood?", (req,res,next) => {

  //make a request to our own server. This will allow us to make changes to the data
  request(`http://localhost:3000/concentration/${req.params.param}/${req.params.hood}`, {json: true}, 
    (error, response) => { //callback
      if(error) return next(error);

      var data = response.body;
      var landuseSum = [];
      var cr4;
      var dataMod;
      //cal data using filter, map, reduce
      for( var SiteCat of VALID_LANDUSE){
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

      console.log(landuseSum);
      res.json(landuseSum);
    })
  
 });

 
 module.exports = router;