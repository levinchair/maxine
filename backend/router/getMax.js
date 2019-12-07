var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var utils = require("./utils");

const NOT_RESIDENTIAL = utils.VALID_LANDUSE.slice(0,5);

router.all("/maxproperties/:city?/:hood?", (req, res, next) => {
    //make the query to get the owners
    this.query = utils.createQuery(req.params.city, req.params.hood, req.body);
    //connect to the data base and retrieve the information 
    var catfilter = { //filter for SiteCat to appropriate scale
        $switch: {
        branches: [
            {case: {$in: ["$properties.SiteCat1", NOT_RESIDENTIAL]}, then: "$properties.total_com_"},
            {case: {$eq: ["$properties.SiteCat1", "Residential"]}, then:  "$properties.Units2"},
            //{case: checkVacant, then: "$properties.total_acre"}
        ], 
        default: "$properties.total_acre"
        }
    }
    var pipeline = [
        {$match:this.query},
        {$group: {
            _id: "$properties.SiteCat1",
            maxValue: { 
                $max: "$properties.certifie_2"},
            maxScale: { //scale based on SiteCat 
                //$push: {cat: catfilter, site:"$properties.SiteCat1", total_com: "$properties.total_com_"}
                $max: catfilter
             },
            maxAcre: { $max: "$properties.total_acre" }
        }},
        {$project: {
            _id: 0,
            SiteCat: "$_id",
            maxValue: 1,
            maxScale: 1,
            maxAcre: 1
        }}
    ]
    db.aggregate(pipeline).exec(
        (err , result ) => {
            if(err) return next("Error when retreiving Max Value", err);
            res.send(result);
        });
  });

module.exports=router;
