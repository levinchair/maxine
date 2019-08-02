
var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var utils = require("./utils");

 router.get("/view2/:param?/:hood?", async (req,res,next)=>{
  /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by view1
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */
     if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
    
     this.query = utils.createQuery(req.params.param, req.params.hood);

      var SiteCat = [];
      //Calculate # of units, # of parcels, Assessed value, % assessed value
      await db.aggregate([
            {"$match": this.query},
            {"$group": {
                  "_id":"$properties.SiteCat2",
                  "No_Units":{"$sum":"$properties.Units2"},
                  "No_Parcels":{"$sum":1},
                  "AssessedValue":{"$sum":"$properties.gross_ce_2"}
                  }},
            {"$project":{ 
                  "No_Units":1,
                  "No_Parcels":1,
                  "AssessedValue":1,
                  "AssessedValPerUnit":{ $cond: [ { $eq: [ "$No_Parcels", 0 ] }, "N/A",{"$divide":["$AssessedValue","$No_Parcels"]}]}
                  }}
            ])
      .exec()
      .then(
      async (result)=>{
            console.log("Reesult : "+ JSON.stringify(result));
            _view2=result;
            // //console.log("view2 raw: " + JSON.stringify(_view2));
            SiteCat=result.map(function(v){ return v._id; })
            // //console.log("view2 : "+JSON.stringify(_view2,undefined,2))
            //calculate CR4
            var totalParcels;
            var parcelsPerUnit;
            var totalParcelsPerUnit=0;
            var cr4;
                  for(var i in SiteCat){
                        cat=SiteCat[i];
                        Object.defineProperty(_view2[i], "cat", {value: SiteCat[i], enumerable: true});
                        console.log("I am in "+SiteCat[i]);
                        //calculate total  # of Units2 under each SiteCat2 Category
                        //define another property for the query. configure to true to allow redefinition.
                        Object.defineProperty(this.query, "properties.SiteCat2" , {value: SiteCat[i], enumerable: true, configurable: true});
                        // console.log("query after cat2 added: " + JSON.stringify(this.query));
                        await db.aggregate([
                              {"$match":this.query},
                              {"$group": {
                                    "_id":null, 
                                    "No_Units":{"$sum":"$properties.Units2"}}}
                        ]).exec()
                        .then((data)=>{
                              // //console.log(JSON.stringify(data));
                              totalParcels=data.map(function(v){return v.No_Units;});
                        // //console.log("Total No. of Units: "+totalParcels);
                        })
                        .catch((err)=>{
                              // console.log("error ocuured : "+err);
                        })

                        //Find the top 4 owner having heighest no of Units2 for each SiteCat2 under "residential category"
                        await  db.aggregate([
                              {"$match":this.query},
                              {"$group":{
                                    "_id":"$properties.deeded_own2",
                                    "No_Units":{"$sum":"$properties.Units2"},
                                    "No_Parcels":{"$sum":1}}},
                                    {"$sort":{"No_Units":-1}},
                                    {"$limit":4}, // top 4
                                    {"$project":{"_id":1,"No_Units":1}}
                              ])
                              .exec()
                              .then((result)=>{parcelsPerUnit=result.map(function(v){return v.No_Units;});
                              //Sum all Parcels per unit
                              totalParcelsPerUnit=0;
                              for(var rs in parcelsPerUnit) totalParcelsPerUnit+=parcelsPerUnit[rs];
                              // //console.log("total Sum of parcelsPerUnit: "+totalParcelsPerUnit+" for cat "+cat);
                              //cocentratic ratio of sum of paercels per unit of top 4 owners to total parcels under residential categary
                              cr4=totalParcelsPerUnit/totalParcels;
                              // console.log("Totalparelsperunit: " + totalParcelsPerUnit);
                              // console.log("totalParcels: " + totalParcels);
                              // console.log("CR4 : "+cr4);
                              // //console.log("cr4: "+cr4);
                              if(_view2[i]._id==SiteCat[i]) _view2[i].CR4=cr4;
                              // //console.log("result.cr4 ",cat," ",result.cr4);
                              // //console.log(JSON.stringify(Object.keys(_view2)));
                              _view2[i].cat = _view2[i].id;
                              
                              return result;

                            })
                            .catch((err)=>{
                              //     console.log("error ocuured : "+err);
                            })
                  }
            console.log("this.view2: ",JSON.stringify(_view2,undefined,2));
            res.json(_view2);
      })
      .catch((err)=>{
            // console.log("query error: " + JSON.stringify(this.query));
            // console.log("error ocuured : "+err);
      })

});
module.exports=router;
