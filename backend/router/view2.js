
var express= require('express')
var router= express.Router()
var db = require("../model/db.js");
var upperCase = require('upper-case')

var _view2={
      _id : String,
      No_Units: Number,
      No_Parcels: Number,
      AssessedValue : Number,
      AssessedValPerUnit: Number,
      CR4 : Number
};

 router.get("/view2/:city", async (req,res,next)=>{

      var SiteCat = [];
      //Calculate # of units, # of parcels, Assessed value, % assessed value
      db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.par_city":upperCase(req.params.city)}},{"$group":
      {"_id":"$properties.SiteCat2","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1},
      "AssessedValue":{"$sum":"$properties.GCERT3"}}},{"$project":{ "No_Units":1,"No_Parcels":1,"AssessedValue":1,
      "AssessedValPerUnit":{ $cond: [ { $eq: [ "$No_Parcels", 0 ] }, "N/A",{"$divide":["$AssessedValue","$No_Parcels"]} ]}} }])
      .exec()
      .then(async (result)=>{
            //console.log("Reesult : "+result)
            _view2=result;


                  //console.log("_view2: ",JSON.stringify(_view2,undefined,2))
                 // res.json(result);
                  SiteCat=result.map(function(v){


                  return v._id;
                  })
                  //console.log("view2 : "+JSON.stringify(_view2,undefined,2))
                  //calculate CR4
                  var totalParcels;
                  var parcelsPerUnit;
                  var totalParcelsPerUnit=0;
                  var cr4;
                  var cat;



                  for(var i in SiteCat){

                        cat=SiteCat[i];
                       // console.log("I am in for "+SiteCat[i]);


                        //calculate total  # of Units2 under each SiteCat2 Category
                        await db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i],"properties.par_city":upperCase(req.params.city)}},{"$group": {"_id":null,"No_Units":{"$sum":"$properties.Units2"}}}])
                        .exec()
                        .then((data)=>{
                              //console.log(JSON.stringify(data));
                              totalParcels=data.map(function(v){

                              return v.No_Units;
                              });
                        //console.log("Total No. of Units: "+totalParcels);


                        })
                        .catch((err)=>{
                              console.log("error ocuured : "+err);
                        })


                        //Find the top 4 owner having heighest no of Units2 for each SiteCat2 under "residential category"

                        await  db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i],"properties.par_city":upperCase(req.params.city)}},{"$group":
                              {"_id":"$properties.PARCL_OWN3","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1}}},{"$sort":{"No_Units":-1}},
                              {"$limit":4},{"$project":{"_id":1,"No_Units":1}}])
                              .exec()
                              .then((result)=>{

                                              //console.log(JSON.stringify(result));
                                              parcelsPerUnit=result.map(function(v){
                                              return v.No_Units;
                                  });
                                  //console.log('_id from result:', result._id);


                              //console.log("Parcels per Unit: "+parcelsPerUnit+" cat= "+cat);
                              //res.send(parcelsPerUnit);


                              //Sum all Parcels per unit

                              totalParcelsPerUnit=0;
                              for(var rs in parcelsPerUnit)
                              {
                                    totalParcelsPerUnit+=parcelsPerUnit[rs];
                              }
                              //console.log("total Sum of parcelsPerUnit: "+totalParcelsPerUnit+" for cat "+cat);
                              //cocentratic ratio of sum of paercels per unit of top 4 owners to total parcels under residential categary
                              cr4=totalParcelsPerUnit/totalParcels;

                              //console.log("CR4 : "+cr4);
                              //console.log("cr4: "+cr4);
                              if(_view2[i]._id==SiteCat[i])
                                    _view2[i].CR4=cr4;
                              //console.log("result.cr4 ",cat," ",result.cr4);

                              return result;

                            })
                            .catch((err)=>{
                                  console.log("error ocuured : "+err);
                            })


                  }


                  console.log("this.view2: ",JSON.stringify(_view2,undefined,2));
                  res.json(_view2);
      })
      .catch((err)=>{
            console.log("error ocuured : "+err);
      })

});

//----------------------------------------------------------view2 of land data selected city and hood-----------------------------------------------------------

router.get("/view2/:city/:hood", async (req,res,next)=>{
  var SiteCat;
  console.log("city: ",req.params.city);
  console.log("hood: ",req.params.hood)
  //Calculate # of units, # of parcels, Assessed value, % assessed value
  db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.par_city":upperCase(req.params.city),
  "properties.SPA_NAME":req.params.hood}},
  {"$group": {"_id":"$properties.SiteCat2","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1},
  "AssessedValue":{"$sum":"$properties.GCERT3"}}},{"$project":{ "No_Units":1,"No_Parcels":1,"AssessedValue":1,
  "AssessedValPerUnit":{ $cond: [ { $eq: [ "$No_Parcels", 0 ] }, "N/A",{"$divide":["$AssessedValue","$No_Parcels"]}]} } }])
  .exec()
  .then(async (result)=>{
              console.log(JSON.stringify(result,undefined,2))
              //res.json(result);
              _view2=result;
              console.log("this.view2: ",JSON.stringify(_view2,undefined,2));
              SiteCat=result.map(function(v){


              return v._id;
              })
              //calculate CR4

              var totalParcels;
              var parcelsPerUnit;
              var totalParcelsPerUnit=0;
              var cr4;
              var cat;


              for(var i in SiteCat){

                    cat=SiteCat[i];
                    console.log("I am in for "+SiteCat[i]);


                    //calculate total  # of Units2 under each SiteCat2 Category
                    await db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i],"properties.par_city":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group": {"_id":null,"No_Units":{"$sum":"$properties.Units2"}}}])
                    .exec()
                    .then((data)=>{
                          console.log(JSON.stringify(data));
                          totalParcels=data.map(function(v){

                          return v.No_Units;
                          });
                    console.log("Total No. of Units: "+totalParcels);


                    })
                    .catch((err)=>{
                          console.log("error ocuured : "+err);
                    })


                    //Find the top 4 owner having heighest no of Units2 for each SiteCat2 under "residential category"

                    await  db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i],"properties.par_city":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group":
                          {"_id":"$properties.PARCL_OWN3","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1}}},{"$sort":{"No_Units":-1}},
                          {"$limit":4},{"$project":{"_id":1,"No_Units":1}}])
                          .exec()
                          .then((result)=>{
                                          console.log(JSON.stringify(result));
                                          parcelsPerUnit=result.map(function(v){
                                          return v.No_Units;
                              });
                          console.log("Parcels per Unit: "+parcelsPerUnit+" cat= "+cat);
                          //res.send(parcelsPerUnit);


                          //Sum all Parcels per unit

                          totalParcelsPerUnit=0;
                          for(var rs in parcelsPerUnit)
                          {
                                totalParcelsPerUnit+=parcelsPerUnit[rs];
                          }
                          console.log("total Sum of parcelsPerUnit: "+totalParcelsPerUnit+" for cat "+cat);
                          //cocentratic ratio of sum of paercels per unit of top 4 owners to total parcels under residential categary
                          cr4=totalParcelsPerUnit/totalParcels;
                          console.log("CR4 : "+cr4);
                          if(_view2[i]._id==SiteCat[i])
                              _view2[i].CR4=cr4;
                         // result.cr4=cr4;
                          //console.log("result.cr4 ",cat," ",result.cr4);
                          //console.log("reeesult: ",result);
                          return result;

                        })
                        .catch((err)=>{
                              console.log("error ocuured : "+err);
                        })


              }

              console.log("this.view2: ",JSON.stringify(_view2,undefined,2));
              res.json(_view2);

  })
  .catch((err)=>{
        console.log("error ocuured : "+err);
  })
});
module.exports=router;
