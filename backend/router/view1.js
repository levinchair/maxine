var express= require('express')
var router= express.Router()
var upperCase = require('upper-case')
var db = require("../model/db.js");

router.get("/view1/:city/:hood",(req,res)=>{
    this.city=req.params.city
    this.hood=req.params.hood
    this.city= upperCase(this.city);
    // this.hood=upperCase(this.hood);
    //this.hood= upperCase(this.hood);
    console.log("selected city ",this.city);
    var totalAssVal;
    console.log("selected hood: ",this.hood);
    //db.aggregate( [ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{ "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },{"$project":{"_id":1,"Assval":1}} ])//,function(err,data){
    db.aggregate( [ {"$match":
                            {"properties.par_city":this.city,"properties.SPA_NAME":this.hood}},
                    { "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },
                    {"$project":{"_id":1,"Assval":1}}
                  ])//,function(err,data){
    .exec(function(err, data) {
         if(err)
          {
            console.log("error ocuured 1: "+err);
          }
          else
          {
             console.log(JSON.stringify(data));
             console.log(data);
             totalAssVal = data.map(function (v) {

                     return v.Assval;
                 });
                 console.log("Total Assessed Value: "+totalAssVal);
          }
        });

    var totalSqFeet;
    // calculate total square feet area
    // db.aggregate( [ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.total_com_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
    db.aggregate( [ {"$match":{"properties.par_city":this.city,"properties.SPA_NAME":this.hood}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.total_com_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
    .exec(function(err, data) {
          if(err)
           {
             console.log("error ocuured 2: "+err);
           }
           else
           {
                  console.log(JSON.stringify(data));
                  totalSqFeet=data.map(function(v){

                      return v.totalsqfeet;
                  });
                  console.log("total SquareFeet Area : "+totalSqFeet);

            /*db.aggregate([ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{"$group":{ "_id":{"cat":"$properties.SiteCat1"},
             "Scale":{"$sum":"$properties.total_com_"}, "AssessedValue":{"$sum":"$properties.gross_ce_2"},"No_parcels":{"$sum":1}} },
             {"$project":{ "Scale":1,"No_parcels":1, "percOfLand":{"$multiply":[{"$divide":["$Scale",Number(totalSqFeet)]},100]},"AssessedValue":1,
              "percOfAssessedVal":{"$multiply":[{"$divide":["$AssessedValue",Number(totalAssVal)]},100]}  } }])
              */
             db.aggregate([ {"$match":{"properties.par_city":upperCase(req.params.city),"properties.SPA_NAME":req.params.hood}},{"$group":{ "_id":{"cat":"$properties.SiteCat1"},
             "Scale":{"$sum":"$properties.total_com_"}, "AssessedValue":{"$sum":"$properties.gross_ce_2"},"No_parcels":{"$sum":1}} },
             {"$project":{ "Scale":1,"No_parcels":1, "percOfLand":{"$divide":["$Scale",Number(totalSqFeet)]},"AssessedValue":1,
              "percOfAssessedVal":{"$divide":["$AssessedValue",Number(totalAssVal)]}  } }])
              .exec(function(err,result){

               if(err)
               {
                   console.log("error ocuured 3: "+err);
               }
               else{
                  console.log(JSON.stringify(result,undefined,2))
                   res.json(result);

               }

             });


          }
           });

  });

  module.exports=router;


//--------------------------------------------------view1 of land data if only city selected----------------------------------------------------
router.get("/view1/:city",(req,res)=>{
    this.city=req.params.city
   // this.hood=req.param.hood
    this.city= upperCase(this.city);
    //this.hood= upperCase(this.hood);
    console.log("selected cities ",this.city);
    var totalAssVal;
    console.log("selected city: ",req.params.city);
    //db.aggregate( [ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{ "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },{"$project":{"_id":1,"Assval":1}} ])//,function(err,data){
    db.aggregate( [ {"$match":{"properties.par_city":this.city}},{ "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },{"$project":{"_id":1,"Assval":1}} ])//,function(err,data){
    .exec(function(err, data) {
         if(err)
          {
            console.log("error ocuured : "+err);
          }
          else
          {
                 console.log(JSON.stringify(data));
                 totalAssVal=data.map(function(v){

                     return v.Assval;
                 });
                 console.log("Total Assessed Value: "+totalAssVal);
          }
        });

    var totalSqFeet;
    // calculate total square feet area
    // db.aggregate( [ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.total_com_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
    db.aggregate( [ {"$match":{"properties.par_city":this.city}},{ "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.total_com_"} } },{"$project":{"_id":0,"totalsqfeet":1}} ])//,function(err,data){
    .exec(function(err, data) {
          if(err)
           {
             console.log("error ocuured : "+err);
           }
           else
           {
                  console.log(JSON.stringify(data));
                  totalSqFeet=data.map(function(v){

                      return v.totalsqfeet;
                  });
                  console.log("total SquareFeet Area : "+totalSqFeet);

            /*db.aggregate([ {"$match":{"properties.par_city":"CLEVELAND","properties.SPA_NAME":"University"}},{"$group":{ "_id":{"cat":"$properties.SiteCat1"},
             "Scale":{"$sum":"$properties.total_com_"}, "AssessedValue":{"$sum":"$properties.gross_ce_2"},"No_parcels":{"$sum":1}} },
             {"$project":{ "Scale":1,"No_parcels":1, "percOfLand":{"$multiply":[{"$divide":["$Scale",Number(totalSqFeet)]},100]},"AssessedValue":1,
              "percOfAssessedVal":{"$multiply":[{"$divide":["$AssessedValue",Number(totalAssVal)]},100]}  } }])
              */
             db.aggregate([ {"$match":{"properties.par_city":upperCase(req.params.city)}},{"$group":{ "_id":{"cat":"$properties.SiteCat1"},
             "Scale":{"$sum":"$properties.total_com_"}, "AssessedValue":{"$sum":"$properties.gross_ce_2"},"No_parcels":{"$sum":1}} },
             {"$project":{ "Scale":1,"No_parcels":1, "percOfLand":{"$multiply":[{"$divide":["$Scale",Number(totalSqFeet)]},100]},"AssessedValue":1,
              "percOfAssessedVal":{"$multiply":[{"$divide":["$AssessedValue",Number(totalAssVal)]},100]}  } }])
              .exec(function(err,result){

               if(err)
               {
                   console.log("error ocuured : "+err);
               }
               else{
                  console.log(JSON.stringify(result,undefined,2))
                   res.json(result);

               }

             });


          }
           });

  });
  module.exports=router;
//--------------------------------------------------view1 of land data if city and neighbourhood selected ----------------------------------------------------


  //------------------------------------------------------view1 of land data with Assessed Value--------------------------------------------------------------------
  /*router.get("/view1/Ass",(req,res)=>{

    var totalAssVal;
    db.aggregate( [ { "$group":{ "_id":null, "Assval": {"$sum":"$properties.gross_ce_2"} } },{"$project":{"_id":1,"Assval":1}} ])//,function(err,data){
     .exec(function(err, data) {
         if(err)
          {
            console.log("error ocuured : "+err);
          }
          else
          {
                 console.log(JSON.stringify(data));
                 totalAssVal=data.map(function(v){

                     return v.Assval;
                 });
                 console.log("total: "+totalAssVal);

                 db.aggregate([ {"$group":{ "_id":{"cat":"$properties.SiteCat1"},
                 "AssessedValue":{"$sum":"$properties.gross_ce_2"}} },
                 {"$project":{ "AssessedValue":1, "percOfAssessedVal":{"$multiply":[{"$divide":["$AssessedValue",Number(totalAssVal)]},100]} } }])//,function(err,result){
                 //Calculate Average Assessed Value :
                /*db.aggregate([ {"$group":{ "_id":{"cat":"$properties.SiteCat1"},
                "AssessedValue":{"$sum":"$properties.gross_ce_2"},"No_parcels":{"$sum":1}} },
                {"$project":{ "AssessedValue":1, "No_parcels":1,"AvgOfAssessedVal":{"$divide":["$AssessedValue","$No_parcels"]}} }])
                */
                /*.exec(function(err,result){

                   if(err)
                   {
                       console.log("error ocuured : "+err);
                   }
                   else{
                      console.log(JSON.stringify(result))
                       res.json(result);

                   }

                 });



          }
        });
  });
  */
