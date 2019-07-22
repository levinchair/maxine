var express= require('express')
var router= express.Router();
var db = require("../model/db.js");
var utils = require('./utils');

const VALID_LANDUSE = ["Industrial", "Government", "Institutional", "Commercial", "Mixed", "Other", "Utility", "Residential"];
const [RESIDENTIAL] = VALID_LANDUSE.slice(-1);

router.get("/concentration/:land_use?/:param?/:hood?", (req, res, next) => {
      /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by Concentration by Owner
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */
  if(req.params.land_use === undefined) return next("Error: Please Specify a SiteCat1 value (undefined)");
  if(!VALID_LANDUSE.includes(req.params.land_use)) return next("Error: Invalid Land Use");
  if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
  
  this.query = utils.createQuery(req.params.param, req.params.hood); //this is the initial match query

  Object.defineProperty(this.query, "properties.SiteCat1", { value : req.params.land_use, enumerable : true });       

  var catfilter = { //filter for SiteCat to appropriate value
    $switch: {
      branches: [
        {case: {$in: ["$properties.SiteCat1", VALID_LANDUSE.slice(0,5)]}, then: "$properties.total_com_"},
        {case: {$eq: ["$properties.SiteCat1", RESIDENTIAL]}, then: "$properties.Units2"},
        //{case: {$or: [{$eq: ["$properties.SiteCat1", "Utility"]},{$in: ["$properties.SiteCat2", ["Residential Vacant", "Commercial Vacant", "Industrial Vacant", "Vacant Agricultural"]]}]}, then: "$properties.total_acre"}
      ], // we need a new category for vacant somehow.. not sure how to add this into the document
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
              value: catfilter
          }
      }
  }
  var owner = {
      _id: "$indivs.Owner_name",
      tot_value: {$first: "$tot_value"},
      tot_OwnerValue: {$sum: "$indivs.value"},
      count: {$sum: 1}
  }
  var split = { //we need  to split the pipeline into two facets
    topCR4: [
      {$limit: 4}, 
      {$group: {
          _id: null, 
          numerator: {$sum: "$tot_OwnerValue"}, 
          indivs: { $push: { OwnerValue: "$tot_OwnerValue", OwnerName: "$_id",}}, 
          totvalue: {$first: "$tot_value"}
      }},
      {$unwind: "$indivs"},
      {$project: {
        _id: 0,
        OwnerName: "$indivs.OwnerName",
        OwnerValue: "$indivs.OwnerValue",
        MarketShare: {$divide: ['$indivs.OwnerValue', "$totvalue"]},          
        CR4: {$divide: ['$numerator', "$totvalue"]}
      }}
    ],
    otherParcels: [
      {$skip: 4},
      {$project: {
        _id: 0,
        OwnerName: "$_id",
        OwnerValue: "$tot_OwnerValue",
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
      indivs: {$push: { OwnerName: "$rows.OwnerName", OwnerValue: "$rows.OwnerValue", MarketShare: "$rows.MarketShare"}}
    }},
    {$unwind: "$indivs"},
    {$project: {
      _id:0,
      MarketCR4: 1,
      MarketShare: "$indivs.MarketShare",
      OwnerValue: "$indivs.OwnerValue",
      OwnerName: "$indivs.OwnerName",
      landUse: req.params.land_use, //directly uses the passed url parameter
    }}
  ]

  db.aggregate(pipeline).exec( (err, result) => {
    if(err) return next("Error at aggregation: " + err);
    console.log(result);
    res.send(result);
  });

 });

 
 module.exports = router;