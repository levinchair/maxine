var express= require('express')
var router= express.Router()
var db = require("../model/db.js");
var utils = require("./utils");

var _view4={
        _id: String,   
        sq_feet: Number, 
        AssessedValue: Number,
        percSq_feet : Number,
        AssessedValPerSqFeet: Number,
        CR4 : Number
    }

router.get("/view4/:param?/:hood?", async (req,res,next)=>{
    if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
    
    this.query = utils.createQuery(req.params.param, req.params.hood);
    
    var totalSqFeet;
    var SiteCat;
    // calculate total square feet area under Industrial category
    await db.aggregate([ 
        {"$match":this.query},
        { "$group":{ "_id":null, "totalsqfeet": {"$sum":"$properties.total_com_"} } },
        {"$project":{"_id":0,"totalsqfeet":1}} 
    ])//,function(err,data){
    .exec()  
        
    .then(async (data)=>{
                // console.log(JSON.stringify(data));
                totalSqFeet=data.map(function(v){
                            
                    return v.totalsqfeet;
                });
                // console.log("total SquareFeet Area : "+totalSqFeet);
                //Calculate # of square feet, % of square feet, Assessed value, % assessed value
                await db.aggregate([
                {"$match":this.query},
                {"$group":{
                    "_id":"$properties.SiteCat2",
                    "sq_feet":{"$sum":"$properties.total_com_"},
                    "AssessedValue":{"$sum":"$properties.gross_ce_2"}}},
                {"$project":{ 
                    "sq_feet":1,
                    "AssessedValue":1, 
                    "percSq_feet":{"$multiply":[{"$divide":["$sq_feet",Number(totalSqFeet)]},100]},
                    "AssessedValPerSqFeet":{ $cond: [ { $eq: [ "$sq_feet", 0 ] },0,{"$divide":["$AssessedValue","$sq_feet"]}]}}}
                ]).exec()
                .then(async (result)=>{
                    _view4=result;
                        // // console.log(JSON.stringify(result,undefined,2))
                        // res.json(result);
                        SiteCat=result.map(function(v){
                        
                            return v._id;
                        })
                        // console.log("Site Categories : "+SiteCat);
                        //Calculate CR4 ratio

                        var totalcom_sq_feet;
                        var com_sq_feet_PerCat;
                        var totalCom_sq_feet_PerCat=0;
                        var cr4;
                        var cat;
    

                        for(var i in SiteCat){

                                cat=SiteCat[i];
                                // console.log("I am in for "+SiteCat[i]);
                                Object.defineProperty(_view4[i], "cat", {value: SiteCat[i], enumerable: true});

                                //calculate total  # of total_com_ under each SiteCat2 Category
                                Object.defineProperty(this.query, "properties.SiteCat2" , {value: SiteCat[i], enumerable: true, configurable: true});
                                await db.aggregate([
                                    {"$match":this.query},
                                    {"$group": {
                                        "_id":null,
                                        "com_sq_feet":{"$sum":"$properties.total_com_"}}}])
                                .exec()
                                .then((data)=>{
                                    // console.log(JSON.stringify(data));
                                    totalcom_sq_feet=data.map(function(v){
                                        
                                    return v.com_sq_feet;
                                    });
                                    // console.log("Total com_sq_feet: "+totalcom_sq_feet);
                            
                                
                                })  
                                .catch((err)=>{
                                    // console.log("error ocuured 3: "+err);  
                                })

                            
                                //Find the top 4 owner having heighest no of total_com_ for each SiteCat2 under "Industrial category" 
                                
                                await  db.aggregate([
                                    {"$match":this.query},
                                    {"$group":{
                                        "_id":"$properties.deeded_own2",
                                        "com_sq_feet":{"$sum":"$properties.total_com_"},
                                        "No_Parcels":{"$sum":1}}},
                                    {"$sort":{"com_sq_feet":-1}},
                                    {"$limit":4},
                                    {"$project":{
                                        "_id":1,
                                        "com_sq_feet":1,
                                        "No_Parcels":1}}
                                ]).exec()
                                .then(async (result)=>{
                                            // console.log(JSON.stringify(result));
                                            com_sq_feet_PerCat=result.map(function(v){     
                                            return v.com_sq_feet;
                                            });
                                            // console.log("Parcels per Unit: "+com_sq_feet_PerCat+" cat= "+cat);
                                            //res.send(parcelsPerUnit);
                                
                        
                                            //Sum all Parcels per unit
                        
                                            totalCom_sq_feet_PerCat=0;
                                            var i=0;
                                            for(var rs in com_sq_feet_PerCat)
                                            {
                                                    totalCom_sq_feet_PerCat+=com_sq_feet_PerCat[rs];
                                                    i++;
                                                    // console.log("i ",i);
                                                    if(i==4)
                                                    {
                                                        Object.defineProperty(this.query, "properties.total_com_", { value: com_sq_feet_PerCat[rs], enumerable:true, configurable:true});
                                                        await  db.aggregate([{"$match": this.query},
                                                        {"$group": {"_id":"$properties.deeded_own2","No_Parcels":{"$sum":1}}},
                                                        {"$project":{"_id":1,"com_sq_feet":1,"No_Parcels":1}}])
                                                        .exec()
                                                        .then((result)=>{
                                                            var own=result.map(function(v){   
                                                                if(v._id!=null){
                                                                // console.log("if if ");
                                                                        return v._id;
                                                                }});
                                                                // console.log("Cr4 Owners",own);
                                                        })
                                                    }
                                            }
                                            // console.log("total Sum of parcelsPerUnit: "+totalCom_sq_feet_PerCat+" for cat "+cat);
                                            //cocentratic ratio of sum of paercels per unit of top 4 owners to total parcels under Industrial categary
                                            cr4=totalCom_sq_feet_PerCat/totalcom_sq_feet;
                                            if(_view4[i]._id==SiteCat[i])  _view4[i].CR4=cr4;
                                            
                                                //res.JSON(cr4);
                                                // result.cr4=cr4;
                                                // // console.log("result.cr4 ",cat," ",result.cr4);
                                                // // console.log();
                                            return result;
                                
                                })
                                .catch((err)=>{
                                            // console.log("error ocuured 4: "+err);
                                })

                            
                        }

                })
                .catch((err)=>{
                        // console.log("error ocuured 2: "+err);
                })
                // //console.log("this.view4: ",JSON.stringify(_view4,undefined,2));
                  res.json(_view4);
                
        })
    .catch((err)=>{
        // console.log("error ocuured 1: "+err);
    })

})

module.exports=router;