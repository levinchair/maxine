var express= require('express')
var router= express.Router()
var db = require("../model/db.js").parcelDataModel;
var utils = require("./utils");

var _view3={
_id: String,   
    sq_feet: Number, 
    AssessedValue: Number,
    percSq_feet : Number,
    AssessedValPerSqFeet: Number,
    CR4 : Number
}
//--------------------------------------------------view3 of land data with city -----------------------------------------------------------------
router.all("/view3/:param?/:hood?", async (req,res,next)=>{
  /*This router will take an array of parcelpins (String[]) or a city and a neighbourhood and find the corresponding values specified by view1
    Using this array for all residential testing: ["11029010", "11029075", "11029011", "11029076", "11029012", "11029077" ]
    A test array with Com, Inst and Res Parcels: 
    ["10924128", "10924051", "10924128", "10924052", "10924127", "10924131", "10924052", "10924027",
     "10924053", "10924129", "10924054", "10924130", "10924023", "10924025", "10924024"  ] */

     if(req.params.param === undefined) return next("Error: Please Specify array of Parcels or a city (undefined)");
     
     this.query = utils.createQuery(req.params.param, req.params.hood);    
     Object.defineProperty(this.query, "properties.SiteCat1" , {value: "Commercial", enumerable: true});
    
    var totalSqFeet;
    var SiteCat;
    // calculate total square feet area under Commercial category
    await db.aggregate( [ 
        {"$match": this.query},
        {"$group":{ 
            "_id":null, 
            "totalsqfeet": {"$sum":"$properties.total_com_"} } },
        {"$project":{
            "_id":0,
            "totalsqfeet":1}} ])
    .exec()  
    .then(async (data)=>{
                // console.log(JSON.stringify(data));
                totalSqFeet=data.map(function(v){return v.totalsqfeet;});
                // console.log("total SquareFeet Area : "+totalSqFeet);
                //Calculate # of square feet, % of square feet, Assessed value, % assessed value
                 await db.aggregate([
                    {"$match": this.query},
                    {"$group":{
                        "_id":"$properties.SiteCat2",
                        "sq_feet":{"$sum":"$properties.total_com_"},
                        "AssessedValue":{"$sum":"$properties.gross_ce_2"}}},
                    {"$project":{
                        "sq_feet":1,
                        "AssessedValue":1, 
                        "percSq_feet":{"$multiply":[{"$divide":["$sq_feet",Number(totalSqFeet)]},100]},
                        "AssessedValPerSqFeet":{ $cond: [ { $eq: [ "$sq_feet", 0 ] }, "0",{"$divide":["$AssessedValue","$sq_feet"]} ]}} }
                ]).exec()
                .then(async (result)=>{
                    _view3=result;

                        //console.log(JSON.stringify(result,undefined,2))
                        //res.json(result);
                        SiteCat=result.map(function(v){
                        
                            return v._id;
                        })
                        // console.log("Site Categories : "+SiteCat);
                        //Calculate CR4 ratio

                        var totalcom_sq_feet;
                        var com_sq_feetPerCat;
                        var totalCom_sq_feetPerCat=0;
                        var cr4;
                        var cat;
    

                        for(var i in SiteCat){

                                cat=SiteCat[i];
                                Object.defineProperty(_view3[i], "cat", {value: SiteCat[i], enumerable: true});
                                // console.log("I am in for "+SiteCat[i]);


                                //calculate total  # total_com_ (square feet) under each SiteCat2 Category
                                Object.defineProperty(this.query, "properties.SiteCat2" , {value: SiteCat[i], enumerable: true, configurable: true});
                                // console.log("query after cat2 added: " + JSON.stringify(this.query));
                                await db.aggregate([
                                    {"$match": this.query},
                                    {"$group": {
                                        "_id":null,
                                        "com_sq_feet":{"$sum":"$properties.total_com_"}}}
                                ]).exec()
                                .then((data)=>{
                                    //console.log(JSON.stringify(data));
                                    totalcom_sq_feet=data.map(function(v){
                                        
                                    return v.com_sq_feet;
                                    });
                                    // console.log("Total com_sq_feet: "+totalcom_sq_feet);
                            
                                
                                })  
                                .catch((err)=>{
                                    // console.log("error occurred at aggregation 2 : "+err);  
                                })

                            
                                //Find the top 4 owner having heighest  # total_com_ (square feet) for each SiteCat2 under "Commercial category" 
                                
                                await  db.aggregate([
                                    {"$match": this.query},
                                    {"$group":{
                                        "_id":"$properties.deeded_own2",
                                        "com_sq_feet":{"$sum":"$properties.total_com_"},
                                        "No_Parcels":{"$sum":1}}},
                                        {"$sort":{"com_sq_feet":-1}},
                                        {"$limit":4},
                                        {"$project":{"_id":1,"com_sq_feet":1,"No_Parcels":1}}
                                ]).exec()
                                .then((result)=>{
                                            //console.log(JSON.stringify(result));
                                            com_sq_feetPerCat=result.map(function(v){     
                                            return v.com_sq_feet;
                                            });
                                            
                                            // console.log("com_sq_feet: "+com_sq_feetPerCat+" cat= "+cat);
                                            //res.send(parcelsPerUnit);
                                
                        
                                            //Sum all  # total_com_ (square feet)
                        
                                            totalCom_sq_feetPerCat=0;
                                            for(var rs in com_sq_feetPerCat)
                                            {
                                                    totalCom_sq_feetPerCat+=com_sq_feetPerCat[rs];
                                            }
                                            // //console.log("total Sum of parcelsPerUnit: "+totalCom_sq_feetPerCat+" for cat "+cat);
                                            //cocentratic ratio of sum  # total_com_ (square feet)  of top 4 owners to total  # total_com_ (square feet) under Commertial categary
                                            cr4=totalCom_sq_feetPerCat/totalcom_sq_feet;
                                            if(_view3[i]._id==SiteCat[i])  _view3[i].CR4=cr4;
                                            
                                                //res.JSON(cr4);
                                            return result;
                                
                                })
                                .catch((err)=>{
                    
                                            // console.log("error occurred at aggregation 3 : "+err);
                                })                
                        }
                })
                .catch((err)=>{
                        // console.log("error occurred at Aggregation 1 : "+err);
                })
                // console.log("this.view3: ",JSON.stringify(_view3,undefined,2));
                res.json(_view3);
    })
    .catch((err)=>{
        // console.log("error ocuured : "+err);
    })

 
});

module.exports=router;