var express= require('express')
var router= express.Router()
var db = require("../model/db.js");
/*router.post('/quotes', (req, res) => {
    console.log('Hellooooooooooooooooo!');
    console.log(req.body);
    var dbInst= new db();

    dbInst.name= req.body.name;
    dbInst.quotes = req.body.quote;
    
  
    dbInst.save(function(err, result) {
      if(err) {
        res.send('error saving ');
      } else {
        console.log(result);
        res.send(result);
      }
    });
  });*/
  //--------------------------------------------------Show distinct cities from selected state--------------------------------------
  router.get("/showcities",(req,res,next)=>{
    var cities=[10000];
    db.distinct("properties.PAR_CITY")
    .exec(function(err, result) {
      if(err) {
       // res.send('error occured')
       res.status(err.status >= 100 && err.status < 600 ? err.code : 500).send(err.message);
      } else {
        console.log(result);
        res.json(result);
       // res.end(result);
        //res.send(result,{cities:cities});
      }
    });
    //next();
});
/*
//----------------------------------------------------------view2 of land data-----------------------------------------------------------
var SiteCat;
 router.get("/view2", async (req,res,next)=>{
  //Calculate # of units, # of parcels, Assessed value, % assessed value
      db.aggregate([{"$match":{"properties.SiteCat1":"Residential"}},{"$group":
      {"_id":"$properties.SiteCat2","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1},
      "AssessedValue":{"$sum":"$properties.GCERT3"}}},{"$project":{ "No_Units":1,"No_Parcels":1,"AssessedValue":1, 
      "AssessedValPerUnit":{"$divide":["$AssessedValue","$No_Parcels"]} } }])
      .exec()
      .then((result)=>{
            console.log(JSON.stringify(result,undefined,2))
            res.json(result);
            SiteCat=result.map(function(v){
                            
                return v._id;
            })
      })
      .catch((err)=>{
            console.log("error ocuured : "+err);
      })
      
      
                /*.exec(function(err,result){
         
                 if(err)
                 {
                     console.log("error ocuured : "+err);
                 }
                 else{
                    console.log(JSON.stringify(result,undefined,2))
                     res.json(result);
                     SiteCat=result.map(function(v){
                            
                      return v._id;
                  });
                  console.log("Site Categories : "+SiteCat);
                 }
                     
               });*/
               
//});
//----------------------------------------------------------view2 of land data with CR4-----------------------------------------------------------
//router.get("/view2/cr4",(req,res)=>{
  /*var totalParcels;
  var parcelsPerUnit;
  var totalParcelsPerUnit=0;
  var cr4;
  var cat;
  
 
  for(var i in SiteCat){

        cat=SiteCat[i];
        console.log("I am in for "+SiteCat[i]);


        //calculate total  # of Units2 under each SiteCat2 Category
        await db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i]}},{"$group": {"_id":null,"No_Units":{"$sum":"$properties.Units2"}}}])
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
       
              
        
  
 // db.aggregate( [ { "$group":{ "_id":null, "Assval": {"$sum":"$properties.GCERT3"} } },{"$project":{"_id":1,"Assval":1}} ])//,function(err,data){
   /*.exec(function(err, data) {   
       if(err)
        {
          console.log("error ocuured : "+err);
        }
        else
        {
               console.log(JSON.stringify(data));
               totalParcels=data.map(function(v){
                           
                   return v.No_Units;
               });
               console.log("Total No. of Units: "+totalParcels);
        }
        });      
     */   
       
      //console.log("SiteCat: "+SiteCat);
      
        //Find the top 4 owner having heighest no of Units2 for each SiteCat2 under "residential category" 
        
     /*   await  db.aggregate([{"$match":{"properties.SiteCat1":"Residential","properties.SiteCat2":SiteCat[i]}},{"$group":
              {"_id":"$properties.PARCL_OWN3","No_Units":{"$sum":"$properties.Units2"},"No_Parcels":{"$sum":1}}},{"$sort":{"No_Units":-1}},
              {"$limit":4},{"$project":{"_id":0,"No_Units":1}}])
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
              console.log();
              //res.JSON(cr4);
              return result;
           
            })
            .catch((err)=>{
                  console.log("error ocuured : "+err);
            })

      
     /*.exec( function(err, result) {   
        if(err)
         {
           console.log("error ocuured : "+err);
         }
         else
         {
                console.log(JSON.stringify(result));
                parcelsPerUnit=result.map(function(v){
                   // total=total+v.No_Parcels;        
                    return v.No_Units;
                });
                console.log("Parcels per Unit: "+parcelsPerUnit+" cat= "+cat);
               //res.send(parcelsPerUnit);
                 
         //console.log(typeof parcelsPerUnit);
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
        console.log();
        //res.JSON(cr4);
      }
    });
  
    
  }
 
     
});*/
module.exports=router;